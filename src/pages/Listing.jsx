import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom' // useParams to get the id of the specific listing and its category name from the URL (/category/:categoryName/:listingId)
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth' // To only show the Contact button at the bottom if that's not the users listing 
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg' // To share the listings link with friends

function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)  // listings is the collection from firestore - params.listingId is the listings id from the url
      const docSnap = await getDoc(docRef)  // To have a snapshot of docRef

      console.log(docSnap.exists());

      if (docSnap.exists()) { // To check whether this documents exists
        console.log(docSnap.data());
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()
  }, [params.listingId])

  return (
    <div>Listing</div>
 
  )
}

export default Listing

// https://stackoverflow.com/questions/67552020/how-to-fix-error-failed-to-compile-node-modules-react-leaflet-core-esm-pat
