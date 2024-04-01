import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login data to the backend server
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });

      // Handle login success
      console.log('Login successful:', response.data);
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button className="custom-button" type="submit">Login</button>
        {error && <div className="error-message">{error}</div>}
      </form>
      <p>Don't have an account? <Link to="/register" className="register-link">Register</Link></p>
      <p><Link to="/welcome" className="welcome-link">Go Back</Link></p>
    </div>
  );
};

export default Login;
