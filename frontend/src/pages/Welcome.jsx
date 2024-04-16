import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css'; // Import CSS file for styling
import { api } from "../components/api";

const WelcomePage = () => {
  useEffect(() => {
    api.get("/auth").then((response) => {
      if (response.data.state == "patient") {
        console.log("redirected due to patient already logged in");
        window.location.href = "/patients/" + response.data.uid + "/";
      }
      if (response.data.state == "physician") {
        console.log("redirected due to physician already logged in");
        window.location.href = "/physicians" + response.data.uid + "/";
       }
    });
  }, []);

  return (
    <div className="welcome-container">
      <h1>Welcome</h1>
      <p>Choose your role:</p>
      <div className="button-container">
        <Link to="/patients/login" className="blue-button">Patient</Link>
        <Link to="/physicians/login" className="blue-button">Physician</Link>
        <Link to="/nurses/login" className="blue-button">Nurse</Link>
      </div>
    </div>
  );
};

export default WelcomePage;
