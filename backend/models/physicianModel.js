// Model that provides functionalities related to physician role.

import mongoose from "mongoose";

// Define the schema for storing physician information
const physicianSchema = new mongoose.Schema({
  // First name of the physician
  firstName: { type: String, required: true },
  // Last name of the physician
  lastName: { type: String, required: true },
  // Hospital ID where the physician works
  hospitalId: { type: String, required: true },
  // Array of patient IDs assigned to the physician
  assignedPatientIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
    // Set default value to an empty array
    default: []
  }
});

// Create and export the model based on the defined schema
export const Physician = mongoose.model('Physician', physicianSchema);
