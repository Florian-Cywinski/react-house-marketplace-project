import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Explore from './pages/Explore'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify';  // To be able to use toastify (to create an alert) in the project
import 'react-toastify/dist/ReactToastify.css';   // To bring in the toastify css file
import PrivateRoute from './components/PrivateRoute'
import Category from './pages/Category'
import CreateListing from './pages/CreateListing'
import Listing from './pages/Listing'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />  {/* <Explore /> is the component that is loaded on / */}
          <Route path='/offers' element={<Offers />} /> {/* <Offers /> is the component that is loaded on /offers */}
          {/* The following is Dynamic Routing and Route Parameter */}
          <Route path='/category/:categoryName' element={<Category />} /> {/* /category/:categoryName because it can be either rent (http://127.0.0.1:3000/category/rent) or sale (http://127.0.0.1:3000/category/sale) */}
          {/* <Route path='/category/:categoryName/:listingId' element={<Category />} /> /category/:categoryName because it can be either rent (http://127.0.0.1:3000/category/rent) or sale (http://127.0.0.1:3000/category/sale) */}
          {/* The following route is a private route - Only the logged in user is allowed to go to its profile page */}
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />   {/* Child (private) route - see at <Outlet /> in PrivateRoute.jsx */}
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/create-listing' element={<CreateListing />} />
          {/* The following is Dynamic Routing and Route Parameters */}
          <Route path='/category/:categoryName/:listingId' element={<Listing />} /> {/* To show a specific listing dependent on the catergory (rent or sale) and its id */}
        </Routes>
        <Navbar />
      </Router>

      <ToastContainer />  {/* To be able to use toastify (to create an alert) in the project */}
    </>
  )
}

export default App
