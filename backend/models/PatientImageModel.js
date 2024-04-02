import mongoose from "mongoose";

const patientImageSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageProcessing', required: true },
  physicianNotes: { type: String, required: true },
  isPublic: { type: Boolean, required: true },
  s3image: { type: String, required: true },
  isBenign: { type: Boolean, required: true },
  benignProbability: { type: String, required: true }
});

export const PatientImage = mongoose.model('PatientImage', patientImageSchema);

// module.exports = PatientImage;