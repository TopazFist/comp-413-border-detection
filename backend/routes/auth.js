import express from "express";
import {
  createPatientUser,
  getPatientUser,
} from "../controllers/authPatientController.js";

import { createPhysicianUser, getPhysicianUser } from "../controllers/authPhysicianController.js";

const router = express.Router();

router.post('/physician/',createPhysicianUser);

router.post('/physician/:username',getPhysicianUser);

router.post('/patient/:username',getPatientUser);

router.post("/", createPatientUser);

router.post('/logout', (req) => {
  delete req.session["username"];
  delete req.session["uid"];
});

export const authRoutes = router