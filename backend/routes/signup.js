import express from "express";
import { createUser } from '../controllers/patientUserController.js'; // Import createUser function

const router = express.Router();

// Route for patient user signup (POST)
router.post('/signup', createUser);

export const signupRoute = router
