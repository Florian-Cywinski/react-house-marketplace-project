import { useState, useEffect, useRef } from 'react' // Fix memory leak warning - useRef (isMounted) // https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks
import { getAuth, onAuthStateChanged } from 'firebase/auth' // onAuthStateChanged: This hook / function will fire of every time the logged in state changes (from logged in to logged out and vice versa)
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

function CreateListing() {
  // eslint-disable-next-line
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)  // If it is later false the user has to type in the lon and lat manually
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  })

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)  // Initial value isMounted = true

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {  // onAuthStateChanged takes in auth and a function which gives back a user object - claaback with a potential user
        if (user) {
          setFormData({ ...formData, userRef: user.uid }) // userRef: user.uid to add a new key value pair to the formData object
        } else {  // if there is no user
          navigate('/sign-in')  // redirect
        }
      })
    }

    return () => {  // ComponentWillUnmount in Class Component
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  if(loading) {
    return <Spinner />
  }

  return (
    <div>Create</div>
  )
}

export default CreateListing
