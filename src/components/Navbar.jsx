import { useNavigate, useLocation } from 'react-router-dom'

// The old way to import SVG's with CRA (create react app)
// import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
// import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
// import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'

// The new way to import SVG's with npm i vite-plugin-svgr and adapting the vite.config.js file
import OfferIcon from '../assets/svg/localOfferIcon.svg?react'
import ExploreIcon from '../assets/svg/exploreIcon.svg?react'
import PersonOutlineIcon from '../assets/svg/personOutlineIcon.svg?react'

// The new way to import SVG's with Vite by having components (see in the components folder e.g OfferIcon.jsx) - use https://svg2jsx.com/ to convert SVG's into jsx components -> but the color of the icon does not change (fill)
// import OfferIcon from './OfferIcon'
// import ExploreIcon from './ExploreIcon'
// import PersonOutlineIcon from './PersonOutlineIcon'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathMatchRoute = (route) => { // To check whether the current page matches the icon. This one icon then gets a different color, like an active status.
    if (route === location.pathname) {
      return true
    }
  }

  return (
    <footer className='navbar'>
      <nav className='navbarNav'>
        <ul className='navbarListItems'>
          <li className='navbarListItem' onClick={() => navigate('/')}>
            <ExploreIcon fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px'/>  {/* fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} to check whether the current page matches the icon. This one icon then gets a different color, like an active status. */}
            <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Explore</p>
          </li>
          <li className='navbarListItem' onClick={() => navigate('/offers')}>
            <OfferIcon fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px'/>
            <p className={pathMatchRoute('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Offers</p>
          </li>
          <li className='navbarListItem' onClick={() => navigate('/profile')}>
            <PersonOutlineIcon fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px'/>
            {/* <PersonOutlineIcon style={{color: pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}} width='36px' height='36px'/> */}     {/* Here I've tryed to change the style since the color of the icon does not change by using the SVG components */}
            <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Profile</p>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Navbar
