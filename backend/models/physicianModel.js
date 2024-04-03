import mongoose from "mongoose";

const physicianSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  hospitalId: { type: String, required: true },
  assignedPatientIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
    default: [] // Set default value to an empty array
  } // Array of patient IDs assigned to the physician
});

export const Physician = mongoose.model('Physician', physicianSchema);

// module.exports = Physician;
