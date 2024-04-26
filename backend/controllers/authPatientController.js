// Controller functions for handling patient authentication and user creation.

import { PatientAuth } from "../models/patientAuthModel.js";
import { createPatient } from "./patientController.js";
import { updateAssignedPatients } from "./physicianController.js";

/**
 * Retrieve patient user from the database and authenticate.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * 
 * @returns {Object} - Response object with login status and patient ID.
 */
const getPatientUser = async (req, res, next) => {
  const { username } = req.params;
  const { password } = req.body;

  try {
    console.log("Received POST request at /auth/", username);
    console.log("Username:", username);
    console.log("Password:", password);

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
    req.session.username = username;
    req.session.uid = patient.patientId;
    req.session.state = "patient";
    res.status(200).json({ message: "Login successful", patientId: patient.patientId});
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
};

/**
 * Check if a patient with the given username already exists.
 * 
 * @param {string} username - Username to check.
 * 
 * @returns {boolean} - Indicates whether the patient exists.
 */
const isExists = async (username) => {
  try {
    // Find a patient with the provided username in the PatientAuth model
    const existingPatient = await PatientAuth.findOne({ username });
    return existingPatient ? true : false;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    // Rethrow the error for handling in calling function
    throw error;
  }
};

/**
 * Create a new patient user.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * 
 * @returns {Object} - Response object with created patient user.
 */
const createPatientUser = async (req, res, next) => {
  const {
    username,
    password,
    firstName,
    lastName,
    address,
    phoneNumber,
    gender,
    age,
    allergies,
    physicianID } = req.body;

  try {
    console.log("Creating patient user...");
    // Check if a user with the same username already exists
    const existingPatient = await PatientAuth.findOne({ username });
    if (existingPatient) {
      // User with the same username already exists
      console.log("User already exists");
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new patient entry in the main table
    const mockRequest = {
      body: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        gender: gender,
        age: age,
        allergies: allergies,
        physicianID: physicianID
      }
    };

    const mockResponse = createMockResponse();
    const mockUpdateResponse = createMockResponse();

    // Create the patient in the patient table
    await createPatient(mockRequest, mockResponse);
    const patientData = mockResponse.send();
    const patientId = patientData._id.toString();

    // Create a new patient user in the PatientAuth model
    const patient = await PatientAuth.create({ username, password, patientId });

    // Update assigned patients for the physician
    const mockUpdateRequest = {
      params: { physicianId: physicianID },
      body: { newPatientId: patientId},
    };

    await updateAssignedPatients(mockUpdateRequest, mockUpdateResponse);
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error creating patient user:", error);
    next(error);
  }
};

/**
 * Create a mock response object for testing.
 * 
 * @returns {Object} - Mock response object.
 */
const createMockResponse = () => {
  let responseData = null;
  let statusCode = 200;

  const res = {
    // Set the status code of the response.
    status(code) {
      statusCode = code;
      return this;
    },
    // Set the JSON response data.
    json(data) {
      responseData = data;
      return this;
    },
    // Get the response data.
    send() {
      return responseData;
    },
  };

  return res;
};

export { getPatientUser, createPatientUser, isExists };
