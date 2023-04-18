import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './screens/Login';
import JoinGame from './screens/JoinGame';
import Dashboard from './screens/Dashboard';
import Register from './screens/Register';
import AdminGame from './screens/AdminGame';
import Logout from './screens/Logout';
import Game from './screens/Game';
import './Wrapper.css';

function Wrapper () {
  const [backgroundImage, setBackgroundImage] = useState('background2');
  const location = useLocation();
  const hideNavBar = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register';

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/login' || location.pathname === '/' || currentPath === '/register') {
      setBackgroundImage('background1');
    } else {
      setBackgroundImage('background2');
    }
  }, [location]);
  return (
    <div className={`app ${backgroundImage}`}>
      {!hideNavBar && (
        <nav className="navBar">
          <ul className="App-link">
            <li id="login" className="hidden">
              <Link id="login" to="/login">
                Login
              </Link>
            </li>
            <li id="register" className="hidden">
              <Link id="register" to="/register">
                Register
              </Link>
            </li>
            <li id="dashboard" className="hidden">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li id="admingame" className="hidden">
              <Link to="/admin_game">Play</Link>
            </li>
            <li id="logout" className="hidden">
              <Link to="/log_out">Logout</Link>
            </li>
          </ul>
        </nav>
      )}
     <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/log_out" element={<Logout />} />
  <Route path="/admin_game"element={<AdminGame />}/>
  <Route path="/play/:sessionId" element={<JoinGame />} />
  <Route path="/play/:sessionId/:playerId/:playerName" element={<Game />} />
</Routes>
    </div>
  );
}

export default Wrapper;
