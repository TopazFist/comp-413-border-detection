import { PatientAuth } from "../models/patientAuthModel.js";
import { createPatient } from "./patientController.js"
import { getPhysician, updatePhysician } from './physicianController.js'

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

const isExists = async (username) => {
  try {
    const existingPatient = await PatientAuth.findOne({ username });
    return existingPatient ? true : false;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    throw error; // Rethrow the error for handling in calling function
  }
};

const createPatientUser = async (req, res, next) => {
  console.log(req.body);
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


    const mockGetResponse = createMockResponse();
    const mockGetRequest = {
      params: { id: physicianID.toString() },
    };
    await getPhysician(mockGetRequest, mockGetResponse);
    const getData = mockGetResponse.send();
    console.log("HI");
    console.log(getData);

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


    await createPatient(mockRequest, mockResponse);
    const patientData = mockResponse.send();
    const patientId = patientData._id;

    const patient = await PatientAuth.create({ username, password });
    const mockUpdateRequest = {
      params: { id: physicianID.toString() },
      body: { assignedPatientIds: patientId },
    };

    await updatePhysician(mockUpdateRequest, mockUpdateResponse);
    const updatedPhysician = mockUpdateResponse.send();
    res.status(200).json(patient);

  } catch (error) {
    console.error("Error creating patient user:", error);
    next(error);
  }
};

const createMockResponse = () => {
  let responseData = null;
  let statusCode = 200;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    send() {
      return responseData;
    },
  };

  return res;
};

export { getPatientUser, createPatientUser, isExists };
