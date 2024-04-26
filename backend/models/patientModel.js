// Model that provides functionalities related to patient role.

import mongoose from "mongoose";

// Define the schema for storing patient information
const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  allergies: { type: String, required: false },
  physicianID: {type: String, required: true}
});

// Create and export the model based on the defined schema
export const Patient = mongoose.model('Patient', patientSchema);
