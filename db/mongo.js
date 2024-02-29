const mongoose = require('mongoose');

const uri = 'mongodb+srv://comp413:comp413@comp413-border-detectio.pf1mqdq.mongodb.net/medical_records?retryWrites=true&w=majority&appName=comp413-border-detection';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB Atlas'));

// Define Schemas
const physicianSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  hospitalId: { type: String, required: true }
});

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  allergies: { type: String, required: true }
});

const patientImageSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  physicianNotes: { type: String, required: true },
  isPublic: { type: Boolean, required: true }
});

const imageProcessingSchema = new mongoose.Schema({
  patientImageId: { type: mongoose.Schema.Types.ObjectId, required: true },
  image: { type: String, required: true },
  lesionBorder: { type: String, required: true },
  lesionSize: { type: String, required: true },
  lesionType: { type: String, required: true }
});

// Create Models
const Physician = mongoose.model('Physician', physicianSchema);
const Patient = mongoose.model('Patient', patientSchema);
const PatientImage = mongoose.model('PatientImage', patientImageSchema);
const ImageProcessing = mongoose.model('ImageProcessing', imageProcessingSchema);

module.exports = { mongoose, Physician, Patient, PatientImage, ImageProcessing };
