import { PatientAuth } from "../models/patientAuthModel.js";

  const getPatientUser = async (req, res, next) => {
    const { username } = req.params;
    const { password } = req.body;
    try {
      console.log("Received POST request at /auth/", username);
      console.log("Username:", username);
      console.log("Password:", password);
      
      // Now you can check the username and password
      // Retrieve the user from the database using the username
      const patient = await PatientAuth.findOne({ username });
      if (!patient) {
        console.log("Patient not found");
        return res.status(404).json({ message: "Patient not found" });
      }
  
      // Validate the password
      const isValidPassword = await patient.isValidPassword(password);
      if (!isValidPassword) {
        console.log("Invalid password");
        return res.status(401).json({ message: "Invalid password" });
      }
  
      // If everything is correct, you can send a success response
      console.log("Login successful");
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Error during login:", error);
      next(error);
    }
  };
  const createPatientUser = async (req, res, next) => {
    console.log(req.body);
    const { username, password } = req.body;
    try {
      console.log("Creating patient user...");
      // Check if a user with the same username already exists
      const existingPatient = await PatientAuth.findOne({ username });
      if (existingPatient) {
        // User with the same username already exists
        console.log("User already exists");
        return res.status(409).json({ message: "User already exists" });
      }
      // User doesn't exist, create a new user
      const patient = await PatientAuth.create({ username, password });
      console.log("Created patient user:", patient);
      res.status(200).json(patient);
    } catch (error) {
      console.error("Error creating patient user:", error);
      next(error); // Pass the error to the error handling middleware
    }
  };

export { getPatientUser, createPatientUser };