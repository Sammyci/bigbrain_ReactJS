import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import Button from '../components/Button';
import encapFetch from '../encap.js';

const Login = () => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const loginRequest = async () => {
    try {
      console.log('login request...');
      const request = await encapFetch('admin/auth/login', '', 'POST', '', {
        email: emailInput,
        password: passwordInput,
      });
      if (request.status === 200) {
        const data = await request.json();
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        throw request.status;
      }
    } catch (error) {
      setEmailInput('');
      setPasswordInput('');
      alert('Invalid username or password');
    }
  };

  return (
    <div className="center-card">
      <h2>Welcome to BIGBRAIN</h2>
      <div>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmailInput(e.target.value)}
          value={emailInput}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPasswordInput(e.target.value)}
          value={passwordInput}
        />
      </div>
      <Button text="Login" onClickFunction={loginRequest} />
      <div>
        <p>Dont have an account?</p>
        <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default Login;
