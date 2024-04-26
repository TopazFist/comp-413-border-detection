// Handles routes related to nurse role.

import express from "express";
import { getNurses, getNurse, createNurse, deleteNurse, updateNurse, assignPatientToNurse } from "../controllers/nurseController.js";

const router = express.Router();

// Route to create a new nurse
router.post('/', createNurse);

// Route to get all nurses
router.get('/', getNurses);

// Route to get a single nurse by ID
router.get('/:id', getNurse);

// Route to delete a nurse by ID
router.delete('/:id', deleteNurse);

// Route to update a nurse's information
router.patch('/:id', updateNurse);

// Route to assign a patient to a nurse
router.post('/assign-patient', assignPatientToNurse);

export const nurseRoutes = router;
