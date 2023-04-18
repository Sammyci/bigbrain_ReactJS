import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'

function Logout () {
  const deleteToken = () => {
    localStorage.removeItem('token');
  };
  const setClassName = (elementId, className) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.className = className;
    }
  };
  const updateMenuVisibility = () => {
    setClassName('login', '');
    setClassName('register', '');
    setClassName('logout', 'hidden');
    setClassName('dashboard', 'hidden');
    setClassName('join-game', 'hidden');
  };
  updateMenuVisibility();
  // redirect to login
  const navigate = useNavigate();
  useEffect(() => {
    deleteToken();
    navigate('/login');
  }, []);
  return <> </>
}

export default Logout;
