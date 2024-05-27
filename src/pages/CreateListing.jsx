import { useState, useEffect, useRef } from 'react' // Fix memory leak warning - useRef (isMounted) // https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks
import { getAuth, onAuthStateChanged } from 'firebase/auth' // onAuthStateChanged: This hook / function will fire of every time the logged in state changes (from logged in to logged out and vice versa)
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'

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

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData  // Destructuring of the formData that it's possible to use e.g. type directly instaed of formData.type

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

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    // To inform the person who created the listing that the discounted price must be lower than the regular price, if this was entered incorrectly
    if (discountedPrice >= regularPrice) {
      setLoading(false)
      toast.error('Discounted price needs to be less than regular price')
      return
    }

    // To inform the creator of a listing that a maximum of 6 images can be uploaded if this was done incorrectly
    if (images.length > 6) {
      setLoading(false)
      toast.error('Max 6 images')
      return
    }

    let geolocation = {}  // The object that holds the lat and lon - see geolocation field in firestore
    let location          // To initialize location - see location field (the whole address) in firestore

    if (geolocationEnabled) { // if geolocationEnabled was set to true (usage with Geocoding API from Google)
      const response = await fetch(   // Make a request to Geocoding API from Google
        // `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
        // `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSy...4ysLII`
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${import.meta.env.VITE_APP_GEOCODE_API_KEY}`
      )

      const data = await response.json()

      // console.log(data);    // REQUEST_DENIED since the API key isn't valid

      // The response (data) gives lat and lon to the typed in (form) address
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0 // geolocation.lat is data.results[0]?.geometry.location.lat if it is not null (??) then it would be 0
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0 // The first ? is needed to don't get an error message

      // For the case a not valid address was typed in like jfjfjgja that can not resolved as address by the API -  response (data) has data.status === 'ZERO_RESULTS'
      location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address  // is either undefined or the formated (by API) address
      // If the address typed in isn't a valid address
      if (location === undefined || location.includes('undefined')) {
        setLoading(false)
        toast.error('Please enter a correct address')
        return
      }
    } else {  // if geolocationEnabled was set to false (usage without Geocoding API from Google)
      geolocation.lat = latitude  // geolocation.lat -> lat is one key of the geolocation object initialized above -> latidude is the value (it comes from the form)
      geolocation.lng = longitude
      location = address          // location is the variable created above - address comes from the form
      // console.log(geolocation, location);
    }

    setLoading(false)

 
  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {  // e.target.value fires of when clicking a button or type in some text or chose a number
      boolean = true  // To set the string of true to a boolean true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    // Files
    if (e.target.files) {   // if it is a file (image)
      setFormData((prevState) => ({...prevState, images: e.target.files}))
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {  // if it is not a file
      setFormData((prevState) => ({...prevState, [e.target.id]: boolean ?? e.target.value}))  // [e.target.id] is the key (e.g. type or bedrooms) - boolean ?? e.target.value it takes boolean as value if it is true or false -> if it is null it takes e.target.value instead (e.g. 5 (bedrooms))
    }
  }

  if(loading) {
    return <Spinner />
  }

  return (
    <div className='profile'>
      
      <header>
        <p className='pageHeader centerText'>Create a Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <div className='createListingContainer'>  {/* I added the class to have a narrow container to center everything */}
            {/* Sell / Rent button - to chose whether the new listing is for sell or for rent */}
            <label className='formLabel'>Sell / Rent</label>
            <div className='formButtons'>
              <button type='button'
                className={type === 'sale' ? 'formButtonActive' : 'formButton'}   // The butto is green if it is selcted and white if not
                id='type' value='sale' onClick={onMutate}>Sell  {/* id='type' is the pice of state (the key) */}
              </button>
              <button type='button'
                className={type === 'rent' ? 'formButtonActive' : 'formButton'}   // The butto is green if it is selcted and white if not
                id='type' value='rent' onClick={onMutate}>Rent
              </button>
            </div>
            {/* The name of the new listing */}
            <label className='formLabel'>Name</label>
            <div>
              <input className='formInputName' type='text' id='name' value={name}
                onChange={onMutate} // onChange and not onClick because it's text
                maxLength='32' minLength='10' required  // The name of the new listing has to be a lenght of min 10 and max 32 - required means that there has to be a name
              />
            </div>

            {/* The number of bed- / bathromms of the new listing */}
            <div className='formRooms flex'>  {/* flex does it make side by side */}
              <div>
                <label className='formLabel'>Bedrooms</label>
                <input className='formInputSmall' type='number' id='bedrooms' value={bedrooms} onChange={onMutate} min='1' max='50' required/>
              </div>
              <div>
                <label className='formLabel'>Bathrooms</label>
                <input className='formInputSmall' type='number' id='bathrooms' value={bathrooms} onChange={onMutate} min='1' max='50' required/>
              </div>
            </div>
            {/* Yes / No parking button - to chose whether the new listing has a parking spot or not */}
            <label className='formLabel'>Parking spot</label>
            <div className='formButtons'>
              <button className={parking ? 'formButtonActive' : 'formButton'} type='button' id='parking' value={true} onClick={onMutate} min='1' max='50'>Yes</button>
              <button className={!parking && parking !== null ? 'formButtonActive' : 'formButton'} type='button' id='parking' value={false} onClick={onMutate}>No</button>
            </div>
            {/* Yes / No furnished button - to chose whether the new listing is furnished or not */}
            <label className='formLabel'>Furnished</label>
            <div className='formButtons'>
              <button className={furnished ? 'formButtonActive' : 'formButton'} type='button' id='furnished' value={true} onClick={onMutate}>Yes</button>
              <button className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'} type='button' id='furnished' value={false} onClick={onMutate}>No</button>
            </div>
            {/* The address of the new listing */}
            <label className='formLabel'>Address</label>
            <textarea className='formInputAddress' type='text' id='address' value={address} onChange={onMutate} required/>
            {/* To show the input fileds for lat and lon if geolocationEnabled is set to false */}
            {!geolocationEnabled && (
              <div className='formLatLng flex'>
                <div>
                  <label className='formLabel'>Latitude</label>
                  <input className='formInputSmall' type='number' id='latitude' value={latitude} onChange={onMutate} required/>
                </div>
                <div>
                  <label className='formLabel'>Longitude</label>
                  <input className='formInputSmall' type='number' id='longitude' value={longitude} onChange={onMutate} required/>
                </div>
              </div>
            )}
            {/* Yes / No offer button - to chose whether the new listing is an offer or not */}
            <label className='formLabel'>Offer</label>
            <div className='formButtons'>
              <button className={offer ? 'formButtonActive' : 'formButton'} type='button' id='offer' value={true} onClick={onMutate}>Yes</button>
              <button className={!offer && offer !== null ? 'formButtonActive' : 'formButton'} type='button' id='offer' value={false} onClick={onMutate}>No</button>
            </div>
            {/* The regular price of the new listing */}
            <label className='formLabel'>Regular Price</label>
            <div className='formPriceDiv'>
              <input className='formInputSmall' type='number' id='regularPrice' value={regularPrice} onChange={onMutate} min='50' max='750000000' required/>
              {type === 'rent' && <p className='formPriceText'>$ / Month</p>}   {/* To show $ / Month next to the input field if it is for rent */}
            </div>
            {/* To show the discounted price if there is one */}
            {offer && (
              <>
                <label className='formLabel'>Discounted Price</label>
                <input className='formInputSmall' type='number' id='discountedPrice' value={discountedPrice} onChange={onMutate} min='50' max='750000000' required={offer}/>
              </>
            )}
          </div>
          {/* To upload images */}
          <label className='formLabel centerText'>Images</label>
          <p className='imagesInfo centerText'>The first image will be the cover (max 6).</p>
          <input className='formInputFile' type='file' id='images' onChange={onMutate} max='6' accept='.jpg,.png,.jpeg' multiple required/>
          {/* The form submit button Create Listing */}
          <button type='submit' className='primaryButton createListingButton'>Create Listing</button>
        </form>

      </main>

    </div>
  )
}

export default CreateListing
