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

router.get("/", (req, res) => res.status(200).json(req.session));

router.post('/logout', (req, res) => {
  delete req.session["username"];
  delete req.session["uid"];
  delete req.session["state"];
  res.status(200).json(req.session);
});

export const authRoutes = router