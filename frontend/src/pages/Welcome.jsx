import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css'; // Import CSS file for styling

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <h2>Welcome</h2>
      <p>Choose your role:</p>
      <div className="button-container">
        <Link to="/login" className="blue-button">Patient</Link>
        <Link to="/login" className="blue-button">Physician</Link>
      </div>
    </div>
  );
};

export default WelcomePage;
