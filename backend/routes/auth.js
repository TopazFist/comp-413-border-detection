// Handles authentication routes for different user roles.

import express from "express";
import { createPatientUser, getPatientUser } from "../controllers/authPatientController.js";
import { createPhysicianUser, getPhysicianUser } from "../controllers/authPhysicianController.js";
import { createNurseUser, getNurseUser } from "../controllers/authNurseController.js";

const router = express.Router();

// Route to create a patient user
router.post("/", createPatientUser);

// Route to create a physician user
router.post('/physician/', createPhysicianUser);

// Route to create a nurse user.
router.post('/nurse/', createNurseUser);

// Route to get patient user details
router.post('/patient/:username', getPatientUser);

// Route to get physician user details
router.post('/physician/:username', getPhysicianUser);

// Route to get nurse user details
router.post('/nurse/:username', getNurseUser);

// Route to get session details
router.get("/", (req, res) => res.status(200).json(req.session));

// Route to logout user and clear session details
router.post('/logout', (req, res) => {
  delete req.session["username"];
  delete req.session["uid"];
  delete req.session["state"];
  res.status(200).json(req.session);
});

export const authRoutes = router;
