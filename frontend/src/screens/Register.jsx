import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import encapFetch from '../encap.js';
import Button from '../components/Button'

function Register () {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [nameInput, setNameInput] = React.useState('');
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  const registerRequest = async () => {
    try {
      const request = await encapFetch('admin/auth/register', '', 'POST', '', {
        email: emailInput,
        password: passwordInput,
        name: nameInput
      })
      if (request.status === 200) {
        console.log('Successful Registration');
        const data = await request.json();
        localStorage.setItem('token', data.token);
        setShowSuccessMessage(true);
        setTimeout(() => navigate('/dashboard'), 2000);
      } else throw request.status
    } catch (error) {
      setEmailInput('')
      setPasswordInput('')
      setNameInput('')
      alert('There is already a registered account with that email')
    }
  }

  return <>
    <div className='center-card'>
      <h2>Welcome to BIGBRAIN Register Page</h2>
      <div>
        <input
          type="text"
          placeholder="Email"
          onChange={e => setEmailInput(e.target.value)}
          value={emailInput}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPasswordInput(e.target.value)}
          value={passwordInput}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Name"
          onChange={e => setNameInput(e.target.value)}
          value={nameInput}
        />
      </div>
      <Button text='Register' onClickFunction={registerRequest}/>
      <div>
        <p>Already have an account?</p>
        <Link to="/login">Login here</Link>
      </div>
      {showSuccessMessage && (
        <div style={ { color: 'green', marginTop: '10px' } }>Registration successful! Redirecting to dashboard...</div>
      )}
    </div>
  </>;
}

export default Register;
