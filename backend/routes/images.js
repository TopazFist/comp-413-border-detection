// Handles routes related to patient images.

import express from "express";
import { getPatientImages, togglePublic, modifyNotes } from "../controllers/imageController.js";

const router = express.Router();

// Route to get all patient images
router.get('/:id', getPatientImages);

// Route to toggle the public status of a patient image
router.put('/:id/public', togglePublic);

// Route to modify the notes of a patient image
router.put('/:id/notes', modifyNotes);

export const imageRoutes = router;
