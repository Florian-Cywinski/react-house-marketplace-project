// This is a custom hook which Brad has from:
// Protected routes in v6
// https://stackoverflow.com/questions/65505665/protected-route-with-firebase
// It's used in PrivateRoute.jsx

// Fix memory leak warning - useRef (isMounted)
// https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks

import { useEffect, useState, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'   // onAuthStateChanged: This hook / function will fire of every time the logged in state changes (from logged in to logged out and vice versa)

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)  // It's like loading - to check whether the user is logged in - right after the response it's set to false
  const isMounted = useRef(true)  // Initial value isMounted = true

  useEffect(() => {
    if (isMounted) {    // Check always mounted component - to only run the following code if it's mounted
      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {  // onAuthStateChanged takes in auth and a function which gives back a user object
        if (user) {
          setLoggedIn(true)
        }
        setCheckingStatus(false)  // Rendering should only happen if this value is set to false
      })
    }

    return () => {    // ComponentWillUnmount in Class Component
      isMounted.current = false
    }
  }, [isMounted])
  // }, [])

  return { loggedIn, checkingStatus } // The return from the hook
}