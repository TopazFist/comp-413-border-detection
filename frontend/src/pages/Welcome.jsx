import { React, useEffect } from "react";
import { api } from "../components/api";
import { Link } from "react-router-dom";
import "./Welcome.css";

/**
 * Component that renders the welcome page and redirects users based on their role.
 */
const WelcomePage = () => {
  /**
   * Check user authentication state.
   */
  useEffect(() => {
    api.get("/auth").then((response) => {
      if (response.data.state == "patient") {
        // Redirect patient to their home page if already logged in
        window.location.href = "/patients/" + response.data.uid + "/";
      }
      if (response.data.state == "physician") {
        // Redirect physician to their home page if already logged in
        window.location.href = "/physicians/" + response.data.uid + "/";
      }
      if (response.data.state == "nurse") {
        // Redirect nurse to their home page if already logged in
        window.location.href = "/nurse/" + response.data.uid + "/";
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
