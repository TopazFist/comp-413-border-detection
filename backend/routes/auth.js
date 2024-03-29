import express from "express";
import {
  createPatientUser,
  getPatientUser,
} from "../controllers/authPatientController.js";

const router = express.Router();

router.post('/:username',getPatientUser)

router.post("/", createPatientUser);

export const authRoutes = router