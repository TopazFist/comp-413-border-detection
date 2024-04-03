import mongoose from "mongoose";

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

export const Patient = mongoose.model('Patient', patientSchema);

// module.exports = Patient;
