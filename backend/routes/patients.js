// Handles routes related to patient role.

import express from "express";
import { createPatient, getPatient, getPatients, deletePatient, updatePatient } from "../controllers/patientController.js";

const router = express.Router();

// Route to create a new patient
router.post('/', createPatient);

// Route to get all patients
router.get('/', getPatients);

// Route to get a single patient by ID
router.get('/:id', getPatient);

// Route to delete a patient by ID
router.delete('/:id', deletePatient);

// Route to update a patient's information
router.patch('/:id' ,updatePatient);

export const patientRoutes = router;
