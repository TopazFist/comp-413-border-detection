const mongoose = require('mongoose');

const physicianSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  hospitalId: { type: String, required: true },
  assignedPatientIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }] // Array of patient IDs assigned to the physician
});

const Physician = mongoose.model('Physician', physicianSchema);

module.exports = Physician;
