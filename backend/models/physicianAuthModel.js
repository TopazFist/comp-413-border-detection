import mongoose from "mongoose";

const physicianAuthSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  physicianId: { type: String, required: true }
});

export const PhysicianAuth = mongoose.model('PatientAuth', physicianAuthSchema);