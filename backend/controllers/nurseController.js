// Controller functions for handling nurse operations.

import { Nurse } from "../models/nurseModel.js";
import mongoose from "mongoose";

/**
 * Get all nurses.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getNurses = async (req, res) => {
  try {
    // Retrieve all nurses from the database and sort them by creation date
    const nurses = await Nurse.find({}).sort({ createdAt: -1 });

    // Send the list of nurses as a JSON response
    res.status(200).json(nurses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get a single nurse by ID.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getNurse = async (req, res) => {
  const { id } = req.params;

  // Check if the user is authorized to access the nurse data
  if (req.session.uid != id) {
    console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
    return res.status(401).json({ message: 'Not Authorized'});
  }

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such nurse' });
  }

  try {
    // Find the nurse by ID in the database
    const nurse = await Nurse.findById(id);
    if (!nurse) {
      return res.status(404).json({ error: 'No such nurse' });
    }

    // Send the nurse data as a JSON response
    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Create a new nurse.
 * 
 * @param {Object} req - Express request object containing the nurse data in the request body.
 * @param {Object} res - Express response object.
 */
const createNurse = async (req, res) => {
  const { firstName, lastName, hospitalId } = req.body;

  try {
    // Create a new nurse record in the database with the provided data
    const nurse = await Nurse.create({ firstName, lastName, hospitalId });

    // Send the created nurse data as a JSON response
    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a nurse.
 * 
 * @param {Object} req - Express request object containing the nurse ID in the URL params.
 * @param {Object} res - Express response object.
 */
const deleteNurse = async (req, res) => {
  const { id } = req.params;

  // Check if the current user has permission to delete this nurse
  if (req.session.uid != id) {
    console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
    return res.status(401).json({ message: 'Not Authorized'});
  }

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such nurse' });
  }

  try {
    // Find and delete the nurse with the provided ID
    const nurse = await Nurse.findOneAndDelete({ _id: id });
    if (!nurse) {
      return res.status(404).json({ error: 'No such nurse' });
    }

    // Send the deleted nurse data as a JSON response
    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update a nurse.
 * 
 * @param {Object} req - Express request object containing the nurse ID in the URL params and updated nurse data in the request body.
 * @param {Object} res - Express response object.
 */
const updateNurse = async (req, res) => {
  const { id } = req.params;

  // Check if the current user has permission to update this nurse
  if (req.session.uid != id) {
    console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
    return res.status(401).json({ message: 'Not Authorized'});
  }

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such nurse' });
  }

  try {
    // Find and update the nurse with the provided ID using the data from the request body
    const nurse = await Nurse.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
    if (!nurse) {
      return res.status(404).json({ error: 'No such nurse' });
    }

    // Send the updated nurse data as a JSON response
    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Assign a patient to a nurse.
 * 
 * @param {Object} req - Express request object containing nurseId and patientId in the request body.
 * @param {Object} res - Express response object.
 */
const assignPatientToNurse = async (req, res) => {
  const { nurseId, patientId } = req.body;

  // Check if the provided nurseId and patientId are valid MongoDB ObjectIDs
  if (!mongoose.Types.ObjectId.isValid(nurseId) || !mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(404).json({ error: 'Invalid IDs' });
  }

  try {
    // Find the nurse by ID
    const nurse = await Nurse.findById(nurseId);
    if (!nurse) {
      return res.status(404).json({ error: 'No such nurse' });
    }

    // Add the patientId to the assignedPatientIds array of the nurse
    nurse.assignedPatientIds.push(patientId);

    // Save the updated nurse object
    await nurse.save();

    // Send the updated nurse data as a JSON response
    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getNurses, getNurse, createNurse, deleteNurse, updateNurse, assignPatientToNurse };
