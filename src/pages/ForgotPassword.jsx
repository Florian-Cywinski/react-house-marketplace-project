import { useState } from 'react'        // This will be a form with an email input
import { Link } from 'react-router-dom' // To have a link back to the sign-in page
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'  // To create an alert

// The old way to import SVG's with CRA (create react app)
// import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg' // Icon for a sign-in button
// The new way to import SVG's with npm i vite-plugin-svgr and adapting the vite.config.js file
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg?react'

function ForgotPassword() {
  const [email, setEmail] = useState('')

  const onChange = (e) => setEmail(e.target.value)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success('Email was sent')
    } catch (error) {
      toast.error('Could not send reset email')
    }
  }

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input type='email' className='emailInput' placeholder='Email' id='email' value={email} onChange={onChange}/>
          <Link className='forgotPasswordLink' to='/sign-in'>Sign In</Link>

          <div className='signInBar'>
            <div className='signInText'>Send Reset Link</div>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword