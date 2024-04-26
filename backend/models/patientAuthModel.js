// Model that provides functionalities related to patient authentication.

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

// Define the schema for patient authentication data
const patientAuthSchema = new Schema({
  // Username for patient authentication
  username: { type: String, required: true },
  // Password for patient authentication
  password: { type: String, required: true },
  // ID of the corresponding patient
  patientId: { type: String, required: true }
});

// Middleware to hash the password before saving
patientAuthSchema.pre('save', async function(next) {
  try {
    // Check if the password has been modified
    if (!this.isModified('password')) {
      return next();
    }

    // Hash the password using bcrypt with a salt factor of 10
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to validate the password provided by the user.
 * 
 * @param {string} password - The password to be validated.
 * 
 * @returns {boolean} A boolean indicating whether the provided password is valid.
 * 
 * @throws {Error} If there's an error during password validation.
 */
patientAuthSchema.methods.isValidPassword = async function(password) {
  try {
    // Compare the provided password with the stored hashed password
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  } catch (error) {
    throw new Error(error);
  }
};

// Create and export the model based on the defined schema
export const PatientAuth = mongoose.model('PatientAuth', patientAuthSchema);
