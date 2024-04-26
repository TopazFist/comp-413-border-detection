// Controller functions for handling nurse authentication and user creation.

import { NurseAuth } from "../models/nurseAuthModel.js";
import { Nurse } from "../models/nurseModel.js";

/**
 * Retrieve nurse user from the database and authenticate.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * 
 * @returns {Object} - Response object with login status and nurse ID.
 */
const getNurseUser = async (req, res, next) => {
  const { username } = req.params;
  const { password } = req.body;

  try {
    // Retrieve the nurse from the database using the username
    const nurse = await NurseAuth.findOne({ username });
    if (!nurse) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    // Validate the password
    const isValidPassword = await nurse.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If everything is correct, you can send a success response
    req.session.username = username;
    req.session.uid = nurse.nurseId;
    req.session.state = "nurse";
    res.status(200).json({ message: "Login successful", nurseId: nurse.nurseId });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new nurse user.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * 
 * @returns {Object} - Response object with created nurse user.
 */
const createNurseUser = async (req, res, next) => {
  const { firstName, lastName, hospitalId, username, password } = req.body;

  try {
    // Check whether a user with the same username already exists
    const existingNurse = await NurseAuth.findOne({ username });
    if (existingNurse) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new nurse entry in the main table
    const newNurse = await Nurse.create({ firstName, lastName, hospitalId });

    // Create a new nurse user in the NurseAuth model
    const nurseId = newNurse._id.toString();
    const nurse = await NurseAuth.create({ username, password, nurseId });

    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getNurseUser, createNurseUser };
