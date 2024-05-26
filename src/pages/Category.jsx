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

function Category() {
  const [listings, setListings] = useState(null)  // It's later an array where all listed properties go in (filtered by either rent or sale)
  const [loading, setLoading] = useState(true)

  const params = useParams()  

  useEffect(() => {
    const fetchListings = async () => { // To create this function is needed since it't not possible to use async directly on useEffect
      try {
        // Get listings reference
        const listingsRef = collection(db, 'listings')  // This is a reference to the collection not to the document - 'listings' is the collection wanted

        // Create a query   - Before Firebase 9: firebase.get().where().orderBy()
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName), // The name categoryName was given in App.jsx - rent (http://127.0.0.1:3000/category/rent) or sale (http://127.0.0.1:3000/category/sale) 
          orderBy('timestamp', 'desc'), // To order this descending by the timestamp
          limit(10)
        )

        // Execute the query (snapshot) 
        const querySnap = await getDocs(q)  // To get the documents to the specific query (q)
        const listings = []   // To initialize an empty array - const can be used when just pushing (objects to it)

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
  }, [params.categoryName]) // params.categoryName because that is used in useEffect

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>
          {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
        </p>
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
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  )
}

export default Category