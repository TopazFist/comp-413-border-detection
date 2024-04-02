import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css';


const PhysicianRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [assignedPatientIds, setAssignedPatientIds] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleHospitalIdChange = (e) => {
    setHospitalId(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("patient ids in html");
      console.log(assignedPatientIds);
      const response = await axios.post('http://localhost:3001/auth/physician', {
        firstName,
        lastName,
        hospitalId,
        assignedPatientIds: [],
        username,
        password,
      });
      console.log('Physician registration successful:', response.data);
      // Redirect or perform additional actions
    } catch (error) {
      setError('Physician registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Physician Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={handleFirstNameChange} />
        </div>
        <div className="input-container">
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={handleLastNameChange} />
        </div>
        <div className="input-container">
          <label>Hospital ID:</label>
          <input type="text" value={hospitalId} onChange={handleHospitalIdChange} />
        </div>
        <div className="input-container">
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">Register</button>
        {error && <div className="error-message">{error}</div>}
      </form>
      <p>
        Already have an account? <Link to="/login" className="login-link">Login</Link>
      </p>
    </div>
  );
};

export default PhysicianRegister;