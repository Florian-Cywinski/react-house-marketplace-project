import { useState, useEffect } from "react"
import { getAuth, updateProfile } from "firebase/auth"
import { useNavigate, Link } from 'react-router-dom'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'

function Profile() {
  // const [user, setUser] = useState(null)
  const auth = getAuth()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const navigate = useNavigate()
  const { name, email } = formData    // To destructure name and email from formData
  const [changeDetails, setChangeDetails] = useState(false)   // To set an update state
  const [listings, setListings] = useState(null)  // To save all (logged in) users listings  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')  // To have all listings

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid), // where the user reference of the listing fits with the logged in user
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)  // To get a snapshot of the query q (all listings from the logged in user)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {  // To run only the code if the name of the logged in user is not the same as the name entered in the input field (then nothing needs to be updated)
        // Update display name in firebase
        await updateProfile(auth.currentUser, {     // The updateProfile function is from "firebase/auth" - It takes in the current (logged in) user and what needs to be updated (as object)
          displayName: name,  // Updates the display name to the name in the form
        })

        // Update in firestore - Cloud Firestore is a NoSQL and serverless real-time database
        const userRef = doc(db, 'users', auth.currentUser.uid)  // To create a reference to the document - users is a collection
        await updateDoc(userRef, {  // To update the document
          name   // To update the name - name: name
        })
      }
    } catch (error) {
      // console.log(error)
      toast.error('Could not update profile details')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({   // To return an object of all form data (prev. state and updated data)
      ...prevState,
      [e.target.id]: e.target.value,  // e.target.id could be name or email (form input tags (name, email))
    }))
  }

  const onDelete = async (listingId) => {     // listingId is listing.id
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))   // To delete the listing from firebase
      const updatedListings = listings.filter((listing) => listing.id !== listingId)  // To delete the listing from the UI
      setListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button type='button' className='logOut' onClick={onLogout}>Logout</button>
      </header>

      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p className='changePersonalDetails'
            onClick={() => {  // To update a user's details
              changeDetails && onSubmit()   // To run the function onSubmit if changeDetails is true
              setChangeDetails((prevState) => !prevState)   // To reset the changeDetails state (from true to false) 
            }}
          >{changeDetails ? 'done' : 'change'}</p>  {/* done is when the update mode is set (after changing the user details click on done) */}
        </div>

        <div className='profileCard'>
          <form>
            <input type='text' id='name'
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails} // To disable the form when not in update mode
              value={name}
              onChange={onChange}
            />
            <input type='email' id='email'
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem        // ListingItem.jsx -> function ListingItem({ listing, id, onDelete }) {
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile