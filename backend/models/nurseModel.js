import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  hospitalId: { type: String, required: true },
  assignedPatientIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
    default: []
  }
});

export const Nurse = mongoose.model("Nurse", nurseSchema);