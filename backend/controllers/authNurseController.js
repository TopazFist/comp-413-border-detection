import { NurseAuth } from "../models/nurseAuthModel.js";
import { Nurse } from '../models/nurseModel.js';

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
    res.status(200).json({ message: "Login successful", nurseId: nurse.nurseId });
  } catch (error) {
    next(error);
  }
};

const createNurseUser = async (req, res, next) => {
  const { firstName, lastName, hospitalId, username, password } = req.body;

  try {
    const existingNurse = await NurseAuth.findOne({ username });

    if (existingNurse) {
      // User with the same username already exists
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