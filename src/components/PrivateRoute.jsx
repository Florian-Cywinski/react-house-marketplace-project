import { Navigate, Outlet } from 'react-router-dom' // Navigate is the component to redirect (Hint: the old redirect component) - Outlet to be able to render child routes / elements
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner'

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus()  // useAuthStatus() is a custom hook which returns the loggedIn and the checkingStatus state

  if (checkingStatus) {
    return <Spinner />
  }

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' /> // <Outlet /> just allows to return child elements : else redirect 
}

export default PrivateRoute
