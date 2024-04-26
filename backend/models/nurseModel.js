// Model that provides functionalities related to nurse role.

import mongoose from "mongoose";

// Define the schema for storing nurse information
const nurseSchema = new mongoose.Schema({
  // First name of the nurse
  firstName: { type: String, required: true },
  // Last name of the nurse
  lastName: { type: String, required: true },
  // Hospital ID where the nurse works
  hospitalId: { type: String, required: true },
  // Array of patient IDs assigned to the nurse
  assignedPatientIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
    default: []
  }
});

// Create and export the model based on the defined schema
export const Nurse = mongoose.model("Nurse", nurseSchema);
