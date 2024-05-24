import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Explore from './pages/Explore'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify';  // To be able to use toastify in the project
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offers' element={<Offers />} />
          {/* The following route is a private route - Only the logged in user is allowed to go to its profile page */}
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />   {/* Child (rivate) route - see at <Outlet /> in PrivateRoute.jsx */}
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
        <Navbar />
      </Router>

      <ToastContainer />  {/* To be able to use toastify in the project */}
    </>
  )
}

export default App
