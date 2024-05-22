import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// The old way to import SVG's with CRA (create react app)
// import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
// import visibilityIcon from '../assets/svg/visibilityIcon.svg'    // The other way to bring it in is because of it's just a source for an img tag
// The new way to import SVG's with npm i vite-plugin-svgr and adapting the vite.config.js file
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg?react'
// import visibilityIcon from '../assets/svg/visibilityIcon.svg?react'    // This is not gonna work because it's used in an <img tag as src
import visibilityIcon from '../assets/svg/visibilityIcon.svg'   // This is the way to import the SVG for the usage as src in an img tag

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false) // [showPassword, setShowPassword] = [state, functionToSetTheState] - if it's true than the PW will be shown as text otherwise as ****
  const [formData, setFormData] = useState({    // In this case the state is an object
    email: '',
    password: '',
  })
  const { email, password } = formData  // Destructuring of the formData that it's possible to use email directly instaed of formData.email

  const navigate = useNavigate()

  const onChange = (e) => {         // To update the form data state
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,  // To use the id it's needed to use [] - e.target.id can be email: od password:  
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()  // To initialize auth

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if (userCredential.user) {
        navigate('/')
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>  {/* This fragment is used to be able to bring in more that one tag / component */}
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input type='email' className='emailInput' placeholder='Email' id='email' value={email} onChange={onChange}/> {/* The id is to be able to use it in the onChange function -> e.target.id */}

          <div className='passwordInputDiv'>
            <input type={showPassword ? 'text' : 'password'} className='passwordInput' placeholder='Password' id='password' value={password} onChange={onChange}/>  {/* if it's true than the PW will be shown as text otherwise as **** */}

            <img src={visibilityIcon}   // To bring in the SVG
              alt='show password' className='showPassword'
              onClick={() => setShowPassword((prevState) => !prevState)}  // To set it to true if it's false and vice versa
            />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>

          <div className='signInBar'>
            <p className='signInText'>Sign In</p>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        {/* <OAuth />   Google OAuth */}

        <Link to='/sign-up' className='registerLink'>Sign Up Instead</Link>
      </div>
    </>
  )
}

export default SignIn
