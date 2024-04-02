import express from "express";
import {
  createPatientUser,
  getPatientUser,
} from "../controllers/authPatientController.js";

import { createPhysicianUser } from "../controllers/authPhysicianController.js";

const router = express.Router();

router.post('/physician',createPhysicianUser);

router.post('/:username',getPatientUser);

router.post("/", createPatientUser);

export const authRoutes = router