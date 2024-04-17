import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const UPLOAD_DIR = "image-uploads/"

const patientImageSchema = new mongoose.Schema({
  patientId: { type: String, ref: 'Patient', required: true },
  physicianNotes: { type: String, required: false, default:"N/A" },
  isPublic: { type: Boolean, required: false, default: false },
  s3image: { type: String, required: true },
  isBenign: { type: Boolean, required: false },
  benignProbability: { type: String, required: false },
  borderDetectionPath: { type: String, required: false }
});

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { id } = req.params;
    fs.stat(path.join(UPLOAD_DIR, id), (err, stats) => {
      if (err && err.code === 'ENOENT') { // if dir does not exist
        fs.mkdir(path.join(UPLOAD_DIR, id), { recursive: true }, (err2) => {
          return console.log(err2);
        });
      }
    });
    cb(null, path.join(UPLOAD_DIR, id)); // Save uploaded files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Add timestamp to file name to avoid overwriting
  }
});
const upload = multer({ storage: storage });

const PatientImage = mongoose.model('PatientImage', patientImageSchema);


export { PatientImage, upload }

// module.exports = PatientImage;