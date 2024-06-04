import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'  // To get the param rent or sale (rent (http://127.0.0.1:3000/category/rent) or sale (http://127.0.0.1:3000/category/sale))
import {
  collection, // Instead of getting a single document
  getDocs,  // To get all documents
  query,  // To make a specific query
  where,  // To use a where clause
  orderBy,
  limit,
  startAfter, // To add pagination (Seitenzahlen)
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Offers() {
  const [listings, setListings] = useState(null)  // It's later an array where all listed properties go in (filtered by either rent or sale)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)  // For pagination

  const params = useParams()  

  useEffect(() => { // To fetch the first 10 listings
    const fetchListings = async () => { // To create this function is needed since it't not possible to use async directly on useEffect
      try {
        // Get listings reference
        const listingsRef = collection(db, 'listings')  // This is a reference to the collection not to the document - 'listings' is the collection wanted

        // Create a query   - Before Firebase 9: firebase.get().where().orderBy()
        const q = query(
          listingsRef,
          where('offer', '==', true),   // Where the offer is equal to true
          orderBy('timestamp', 'desc'), // To order this descending by the timestamp
          limit(2)
        )

        // Execute the query (snapshot) 
        const querySnap = await getDocs(q)  // To get the documents to the specific query (q)
        const listings = []   // To initialize an empty array - const can be used when just pushing (objects to it)
        const lastVisible = querySnap.docs[querySnap.docs.length - 1] // To get the last listing (object (truethy))
        setLastFetchedListing(lastVisible)

        querySnap.forEach((doc) => {
          return listings.push({  // To push an object with the id and the data for each document
            id: doc.id,
            data: doc.data(),
          })
        })

        setListings(listings) // To update the listings state
        setLoading(false)   // After getting the data
      } catch (error) {
        toast.error('Could not fetch listings')
      }
    }

    fetchListings()
  }, []) 

  // Pagination / Load More Listings - To fetch another 10 listings to the listings already fetched
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, 'listings')

      // Create a query
      const q = query(
        listingsRef,
        where('offer', '==', true),   // Where the offer is equal to true
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(2)
      )

      // Execute query
      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)
      console.log(lastVisible);

      const listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings((prevState) => [...prevState, ...listings])   // ...prevState to spread accros the prev listings - ...listings to spread accros the new 10 listings (adds on to the last 10, 20 whatever)
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch listings')
    }
  }

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}     // isting.id is the document id in Firestore
                  key={listing.id}    // isting.id is the document id in Firestore
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {lastFetchedListing && (  // Shows the the p tag and runs onFetchMoreListings if lastFetchedListing is Truthy (it's truethy when lastFetchedListing is the last fetched listing which is an object - otherwise it is undefined (falsy))
            <p className='loadMore' onClick={onFetchMoreListings}>Load More</p>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  )
}

export default Offers