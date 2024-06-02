import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'  // To navigate to the specific listing when click on an image (images from different listings are shown in the slider)
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
// The following is the old way to implement slider
// import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/swiper-bundle.css'
// SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])
// The next to lines are the new way to implement slider
import { register } from 'swiper/element/bundle'; // import function to register Swiper custom elements
register(); // register Swiper custom elements
import Spinner from './Spinner'

function Slider() {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {   // To fetch the listings
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)  // To have a snapshot of all listings

      let listings = []

      querySnap.forEach((doc) => {  // loop through all listing documents
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchListings()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listings.length === 0) {
    return <></>
  }

  return (
    listings && (
      <>
        <p className='exploreHeading'>Recommended</p>
        <swiper-container slides-per-view={1} navigation="true" pagination-clickable="true" autoplay-delay="5000" loop="true" cursor="pointer">  {/* https://www.freecodecamp.org/news/how-to-set-up-swiper-element-in-a-react-application/ -> All Swiper parameters are written in the form of kebab-case attributes on the <swiper-container> Custom Elements */}
          {listings.map(({ data, id }) => (  // loop through all listings
            <swiper-slide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
              <div style={{background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: 'cover', height: '50vh', cursor: '-webkit-grab', cursor: 'grab'}} className='swiperSlideDiv'>
                <p className='swiperSlideText'>{data.name}</p>
                <p className='swiperSlidePrice'>
                  {/* ${data.discountedPrice ?? data.regularPrice}  Displays the discounted price, if available - If no discounted price exists and the value is null, the code to the right of the ?? is executed and the regular price is displayed. */}
                  ${data.offer  // To show either the discounted or the regular price
                    ? data.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')  // To have a Thousands separator
                    : data.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  {' '}                                         {/* Just to have a white space - in case the next line is used  */}
                  {data.type === 'rent' && '/ month'}           {/* To add / month if the listing is available for rent */}
                </p>
              </div> 
            </swiper-slide>
          ))}
        </swiper-container>
      </>
    )
  )
}

export default Slider
