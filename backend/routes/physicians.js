// Handles routes related to physician role.

import express from "express";
import { createPhysician, getPhysician, getPhysicians, deletePhysician, updatePhysician } from "../controllers/physicianController.js";

const router = express.Router();

// Route to create a new physician
router.post('/', createPhysician);

// Route to get all physicians
router.get('/', getPhysicians);

// Route to get a single physician by ID
router.get('/:id', getPhysician);

// Route to delete a physician by ID
router.delete('/:id', deletePhysician);

// Route to update a physician's information
router.patch('/:id', updatePhysician);

export const physicianRoutes = router;
