import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'   // useParams to get the UID from the URL - useSearchParams to het the quey string from the URL (e.g. ?listingName=Flowery Branch Beauty)
import { doc, getDoc } from 'firebase/firestore'  // To get the email address of the user to send the form to this user
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

function Contact() {
  const [message, setMessage] = useState('')
  const [landlord, setLandlord] = useState(null)
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams() // To get the listing name due to the search param / query string (e.g. ?listingName=Flowery Branch Beauty)
  const params = useParams()  // To get the UID from the URL

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setLandlord(docSnap.data())
      } else {
        toast.error('Could not get landlord data')  // e.g. if the landloard doesn'texist anymore (in the db)
      }
    }

    getLandlord()
  }, [params.landlordId])

  const onChange = (e) => setMessage(e.target.value)

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className='contactLandlord'>
            <p className='landlordName'>Contact {landlord?.name}</p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message' className='messageLabel'>Message</label>
              <textarea name='message' id='message' className='textarea' value={message} onChange={onChange}></textarea>
            </div>

            {/* A link to email the user with the listing name (due to the search param / query string (e.g. ?listingName=Flowery Branch Beauty)) as subject */}
            <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
              <button type='button' className='primaryButton'>Send Message</button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}

export default Contact
