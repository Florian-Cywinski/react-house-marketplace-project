import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// The old way to import SVG's with CRA (create react app)
// import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
// import visibilityIcon from '../assets/svg/visibilityIcon.svg'    // The other way to bring it in is because of it's just a source for an img tag
// The new way to import SVG's with npm i vite-plugin-svgr and adapting the vite.config.js file
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg?react'
// import visibilityIcon from '../assets/svg/visibilityIcon.svg?react'    // This is not gonna work because it's used in an <img tag as src
import visibilityIcon from '../assets/svg/visibilityIcon.svg'   // This is the way to import the SVG for the usage as src in an img tag

function SignUp() {
  const [showPassword, setShowPassword] = useState(false) // [showPassword, setShowPassword] = [state, functionToSetTheState] - if it's true than the PW will be shown as text otherwise as ****
  const [formData, setFormData] = useState({    // In this case the state is an object
    name: '',
    email: '',
    password: '',
  })
  const { name, email, password } = formData  // Destructuring of the formData that it's possible to use email directly instaed of formData.email

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = () => {

  }

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input type='text' className='nameInput' placeholder='Name' id='name' value={name} onChange={onChange}/>  {/* The id is to be able to use it in the onChange function -> e.target.id */}
          <input type='email' className='emailInput' placeholder='Email' id='email' value={email} onChange={onChange}/>

          <div className='passwordInputDiv'>
            <input type={showPassword ? 'text' : 'password'} className='passwordInput' placeholder='Password' id='password' value={password} onChange={onChange}/>  {/* if it's true than the PW will be shown as text otherwise as **** */}

            <img src={visibilityIcon} // To bring in the SVG
              alt='show password' className='showPassword'
              onClick={() => setShowPassword((prevState) => !prevState)}  // To set it to true if it's false and vice versa
            />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>

          <div className='signUpBar'>
            <p className='signUpText'>Sign Up</p>
            <button className='signUpButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        {/* Google OAuth */}

        <Link to='/sign-in' className='registerLink'>Sign In Instead</Link>
      </div>
    </>
  )
}

export default SignUp
