import express from "express";
import {
  createPatientUser,
  getPatientUser,
} from "../controllers/authPatientController.js";

import { createPhysicianUser, getPhysicianUser } from "../controllers/authPhysicianController.js";

import { createNurseUser, getNurseUser } from "../controllers/authNurseController.js";

const router = express.Router();

router.post('/nurse/',createNurseUser);

router.post('/physician/',createPhysicianUser);

router.post('/nurse/:username',getNurseUser);

router.post('/physician/:username',getPhysicianUser);

router.post('/patient/:username',getPatientUser);

// router.post('/nurse/',createNurseUser);

router.post("/", createPatientUser);

export const authRoutes = router