import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css';

const PhysicianRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [assignedPatientIds, setAssignedPatientIds] = useState([]);
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

  const handleAssignedPatientIdsChange = (e) => {
    const patientIds = e.target.value.split(',').map((id) => id.trim());
    setAssignedPatientIds(patientIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/physicians', {
        firstName,
        lastName,
        hospitalId,
        assignedPatientIds,
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
          <label>Assigned Patient IDs (comma-separated):</label>
          <input type="text" value={assignedPatientIds.join(', ')} onChange={handleAssignedPatientIdsChange} />
        </div>
        <button type="submit">Register</button>
        {error && <div className="error-message">{error}</div>}
      </form>
      <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
    </div>
  );
};

export default PhysicianRegister;