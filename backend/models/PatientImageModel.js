// Model that provides functionalities related to patient images.

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import multer from "multer";

// Directory for storing uploaded images
const UPLOAD_DIR = "image-uploads/";

// Define the schema for patient images
const patientImageSchema = new mongoose.Schema({
  patientId: { type: String, ref: 'Patient', required: true },
  physicianNotes: { type: String, required: false, default: "N/A" },
  isPublic: { type: Boolean, required: false, default: true },
  s3image: { type: String, required: true },
  isBenign: { type: Boolean, required: false },
  benignProbability: { type: String, required: false },
  borderDetectionPath: { type: String, required: false },
  heatmapPath: { type: String, required: false },
});

// Define the multer disk storage configuration to handle file uploads
const storage = multer.diskStorage({
  // Define the destination directory for storing uploaded files
  destination: function (req, file, cb) {
    // Extract patient ID from request parameters
    const { id } = req.params;
    fs.stat(path.join(UPLOAD_DIR, id), (err, stats) => {
      // Create directory if it doesn't exist
      if (err && err.code === 'ENOENT') {
        fs.mkdir(path.join(UPLOAD_DIR, id), { recursive: true }, (err2) => {
          return console.log(err2);
        });
      }
    });
    // Save uploaded files to the 'uploads' directory
    cb(null, path.join(UPLOAD_DIR, id));
  },
  // Define the filename for storing the uploaded file
  filename: function (req, file, cb) {
    // Add timestamp to file name to avoid overwriting
    cb(null, file.originalname);
  }
});

// Multer middleware for file upload
const upload = multer({ storage: storage });

// Create the model based on the defined schema
const PatientImage = mongoose.model('PatientImage', patientImageSchema);

// Export the model and upload middleware
export { PatientImage, upload };
