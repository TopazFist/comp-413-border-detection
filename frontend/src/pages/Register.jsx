import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css'; // Import the CSS file

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [allergies, setAllergies] = useState('');
  const [physicianID, setPhysicianID] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleAllergiesChange = (e) => {
    setAllergies(e.target.value);
  };

  const handlePhysicianChange = (e) => {
    setPhysicianID(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send registration data to the backend server
      const response = await axios.post('http://localhost:3001/auth', {
        username,
        password,
        firstName,
        lastName,
        address,
        phoneNumber,
        gender,
        age,
        allergies,
        physicianID
      });

      // Redirect to the login page after successful registration
      console.log('Registration successful:', response.data);
      window.location.href = '/patients/login'; // Redirect to the login page
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <div className="input-container">
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={handleFirstNameChange} />
        </div>
        <div className="input-container">
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={handleLastNameChange} />
        </div>
        <div className="input-container">
          <label>Address:</label>
          <input type="text" value={address} onChange={handleAddressChange} />
        </div>
        <div className="input-container">
          <label>Phone Number:</label>
          <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} />
        </div>
        <div className="input-container">
          <label>Gender:</label>
          <input type="text" value={gender} onChange={handleGenderChange} />
        </div>
        <div className="input-container">
          <label>Age:</label>
          <input type="number" value={age} onChange={handleAgeChange} />
        </div>
        <div className="input-container">
          <label>Allergies:</label>
          <input type="text" value={allergies} onChange={handleAllergiesChange} />
        </div>
        <div className="input-container">
          <label>Physician ID:</label>
          <input type="text" value={physicianID} onChange={handlePhysicianChange} />
        </div>
        <button type="submit">Register</button>
        {error && <div className="error-message">{error}</div>}
      </form>
      <p>Already have an account? <Link to="/patients/login" className="login-link">Login</Link></p>
    </div>
  );
};

export default Register;
