import { Link } from 'react-router-dom'
// The old way to import SVG's with CRA (create react app)
// import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
// import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
// The new way to import SVG's with npm i vite-plugin-svgr and adapting the vite.config.js file
import DeleteIcon from '../assets/svg/deleteIcon.svg?react'
import EditIcon from '../assets/svg/editIcon.svg?react'
// The following icons will be imported directly
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

function ListingItem({ listing, id, onDelete }) {
  return (
    <li className='categoryListing'>
      <Link
        to={`/category/${listing.type}/${id}`}
        className='categoryListingLink'
      >
        <img
          src={listing.imageUrls[0]}  // listing.imgUrls[0] to get the first image of this listing (Advertisement)
          alt={listing.name}
          className='categoryListingImg'
        />
        <div className='categoryListingDetails'>
          <p className='categoryListingLocation'>{listing.location}</p>
          <p className='categoryListingName'>{listing.name}</p>

          <p className='categoryListingPrice'>
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()                               // To have a comma when the price is 1000 or more (e.g. $2,000)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')    // To have a comma when the price is 1000 or more (e.g. $2,000)
              : listing.regularPrice
                  .toString()                               // To have a comma when the price is 1000 or more (e.g. $2,000)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}   {/* To have a comma when the price is 1000 or more (e.g. $2,000) */}
            {listing.type === 'rent' && ' / Month'}         {/* If the property is for rent the price is per month */}
          </p>
          <div className='categoryListingInfoDiv'>
            <img src={bedIcon} alt='bed' />
            <p className='categoryListingInfoText'>
              {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'} {/* listing.bedrooms is the number of bedrooms */}
            </p>
            <img src={bathtubIcon} alt='bath' />
            <p className='categoryListingInfoText'>
              {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
            </p>
          </div>
        </div>
      </Link>

      {onDelete && (  // onDelete is a function that allows the user to delete their own properties, if listed  - if the user is in delete mode the delete icon appears
        <DeleteIcon
          className='removeIcon'
          fill='rgb(231, 76,60)'
          onClick={() => onDelete(listing.id, listing.name)}  // isting.id is the document id in Firestore
        />
      )}

    </li>
  )
}

export default ListingItem
