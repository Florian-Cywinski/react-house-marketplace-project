import { useState, useEffect } from "react"
import { getAuth } from "firebase/auth"
import { useNavigate } from 'react-router-dom'

function Profile() {
  const [user, setUser] = useState(null)
  const auth = getAuth()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const navigate = useNavigate()
  const { name, email } = formData    // To destructure name and email from formData

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button type='button' className='logOut' onClick={onLogout}>
          Logout
        </button>
      </header>
    </div>
  )
}

export default Profile