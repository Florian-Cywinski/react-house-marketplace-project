import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom' // useParams to get the id of the specific listing and its category name from the URL (/category/:categoryName/:listingId)
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth' // To only show the Contact button at the bottom if that's not the users listing 
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg' // To share the listings link with friends
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'  // At Brad's the time the following error occured - I had no problems - https://stackoverflow.com/questions/67552020/how-to-fix-error-failed-to-compile-node-modules-react-leaflet-core-esm-pat
import { toast } from 'react-toastify'

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

      if (docSnap.exists()) { // To check whether this documents exists
        // console.log(docSnap.data());
        setListing(docSnap.data())
        setLoading(false)
      } else {
        toast.error('Unable to load the data')
        setTimeout(() => {  
          navigate('/')  // redirect
        }, 2000) 
      }
    }

    fetchListing()
  }, [params.listingId])

  if (loading) {
    return <Spinner />
  }

  return (
    <main>
      {/* To be able to copy the link to the clipboard */}
      <div className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href) // window.location.href is the url - navigator.clipboard.writeText to bring in the link
          // To have a message that the link has been copied (it's true for 2 sec.)
          setShareLinkCopied(true)
          setTimeout(() => {  
            setShareLinkCopied(false)
          }, 2000)
        }}
        ><img src={shareIcon} alt='' />
      </div>
      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}   {/* To show the message that the link was copied for 2 sec. - http://127.0.0.1:3000/category/sale/6F0JPSosb2vsRMrTKEGw */}

      {/* To display the Listing Details */}
      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name} - $
          {listing.offer  // To show either the discounted or the regular price
            ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')  // To have a Thousands separator
            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
        {/* To show the discount between the regular and the offer price */}
        {listing.offer && (<p className='discountPrice'>${listing.regularPrice - listing.discountedPrice} discount</p>
        )}
        {/* To list the number of bedrooms etc */}
        <ul className='listingDetailsList'>
          <li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}</li>
          <li>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}</li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        {/* To show the location - Leaflet Map */}
        <p className='listingLocationTitle'>Location</p>    {/* The heading for the map */}
        <div className='leafletContainer'>
          <MapContainer
              style={{ height: '100%', width: '100%' }}
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={13}
              scrollWheelZoom={false}
            > {/* The following is inside the MapContainer */}
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
              />
              <Marker
                position={[listing.geolocation.lat, listing.geolocation.lng]}
              >
                <Popup>{listing.location}</Popup>   {/* Shows the address on hover over the marker */}
              </Marker>
            </MapContainer>
        </div>

        {/* To have a Contact button (just if the listing isn't a listing from the logged in user) */}
        {auth.currentUser?.uid !== listing.userRef && (     // if the listing isn't a listing from the logged in user - the ? to avoid getting an error saying it's null
          <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>Contact Landlord</Link>  // ?listingName=${listing.name} is a query string - e.g. /contact/UqI39...k1?listingName=Flowery%20Branch%20Beauty
        )}

      </div>

    </main>
  )
}

export default Listing

