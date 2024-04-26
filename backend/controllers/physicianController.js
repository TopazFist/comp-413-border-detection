// Controller functions for handling physician operations.

import { Physician } from "../models/physicianModel.js";
import mongoose from "mongoose";

/**
 * Retrieve all physicians from the database.
 * 
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 */
const getPhysicians = async (req, res) => {
  // Retrieve all physicians from the database, sorted by creation date in descending order
  const physicians = await Physician.find({}).sort({ createdAt: -1 });

  // Send the retrieved physicians as a JSON response
  res.status(200).json(physicians);
}

/**
 * Retrieves a single physician by ID from the database.
 * 
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 */
const getPhysician = async (req, res) => {
  const { id } = req.params;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "No such physician"});
  }

  // Find the physician in the database by ID
  const physician = await Physician.findOne({ _id: id });
  if (!physician) {
    return res.status(404).json({error: "No such physician"});
  }

  // Send the physician as a JSON response
  res.status(200).json(physician);
}

/**
 * Assigns a new patient to a physician and updates the assigned patient list in the database.
 * 
 * @param {Object} req - The Express.js request object containing parameters and body.
 * @param {Object} res - The Express.js response object.
 */
const updateAssignedPatients = async (req, res) => {
  // Extract physicianId from request parameters
  const { physicianId } = req.params;
  // Extract newPatientId from request body
  const { newPatientId: newPatientId } = req.body;

  try {
    // Find the physician in the database by ID
    const physician = await Physician.findById(physicianId);
    if (!physician) {
      return res.status(404).json({ message: 'Physician not found' });
    }
    
    // Add the new patient ID to the assigned patient list of the physician
    physician.assignedPatientIds.push(newPatientId);

    // Save the updated physician object in the database
    await physician.save();

    // Send a success response
    res.status(200).json({ message: 'Patient assigned to physician successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Removes a patient from a physician's assigned patient list and updates the database.
 * 
 * @param {Object} req - The Express.js request object containing parameters and body.
 * @param {Object} res - The Express.js response object.
 */
const removePatientFromPhysician = async (req, res) => {
  // Extract physicianId from request parameters
  const { physicianId } = req.params;
  // Extract patientId to be removed from request body
  const { patientId: patientToRemove } = req.body;

  try {
    // Update the physician document in the database to remove the patientId from assignedPatientIds array
    const updatedPhysician = await Physician.findOneAndUpdate(
      { _id: physicianId },
      { $pull: { assignedPatientIds: patientToRemove } },
      { new: true }
    );

    // Check if the physician exists
    if (!updatedPhysician) {
      return res.status(404).json({ message: 'Physician not found' });
    }

    // Respond with success message
    res.status(200).json({ message: "Patient removed from physician's list successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

/**
 * Create a new physician.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const createPhysician = async (req, res) => {
  const { firstName, lastName, hospitalId } = req.body;

  // Attempt to add the physician to the database
  try {
    // Create a new physician entry in the database
    const physician = await Physician.create({ firstName, lastName, hospitalId });
    
    // Send a success response with the newly created physician data
    res.status(200).json(physician);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Delete a physician.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deletePhysician = async (req, res) => {
  // Extract the physician ID from the request parameters
  const { id } = req.params;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such physician" });
  }

  // Find the physician by ID
  const physician = await Physician.findOneAndDelete({ _id: id });
  if (!physician) {
    return res.status(400).json({ error: "No such physician" });
  }

  // Send a response with the deleted physician data
  res.status(200).json(physician);
}

/**
 * Update physician data.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updatePhysician = async (req, res) => {
  // Extract the physician ID from the request parameters
  const { id } = req.params;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such physician" });
  }

  try {
    // Find and update the physician by ID
    const updatedPhysician = await Physician.findOneAndUpdate(
        { _id: id },
        // Use $set to update the fields provided in req.body
        { $set: req.body },
        { new: true }
    );
    if (!updatedPhysician) {
        return res.status(404).json({ error: "No such physician" });
    }

    // Send a response with the updated physician data
    res.status(200).json(updatedPhysician);
  } catch (error) {
      console.error('Error updating physician:', error);
      res.status(500).json({ error: "Internal server error" });
  }
};

export {
  createPhysician,
  getPhysician,
  updateAssignedPatients,
  removePatientFromPhysician,
  getPhysicians,
  deletePhysician,
  updatePhysician
}
