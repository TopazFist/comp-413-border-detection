import { PhysicianAuth } from "../models/physicianAuthModel.js";
import { Physician } from '../models/physicianModel.js';


const getPhysicianUser = async (req, res, next) => {
  const { username } = req.params;
  const { password } = req.body;

  try {
    console.log("Received POST request at /auth/physician", username);
    console.log("Username:", username);
    console.log("Password:", password);

    // Retrieve the physician from the database using the username
    const physician = await PhysicianAuth.findOne({ username });

    if (!physician) {
      console.log("Physician not found");
      return res.status(404).json({ message: "Physician not found" });
    }

    // Validate the password
    const isValidPassword = await physician.isValidPassword(password);

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

const createPhysicianUser = async (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, hospitalId, assignedPatientIds, username, password } = req.body;

  try {

    const existingPhysician = await PhysicianAuth.findOne({ username });
    if (existingPhysician) {
      // User with the same username already exists
      console.log("User already exists");
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new physician entry in the main table
    const newPhysician = await Physician.create({
      firstName,
      lastName,
      hospitalId,
      assignedPatientIds
    });

    // Create a new physician user in the PhysicianAuth model
    const physicianId = newPhysician._id.toString();
    const physician = await PhysicianAuth.create({
      username,
      password,
      physicianId
    });

    res.status(200).json(physician);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getPhysicianUser, createPhysicianUser, isExists };