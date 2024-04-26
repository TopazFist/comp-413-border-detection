// Handles routes related to uploading patient images.

import express from "express";
import { uploadImage, uploadMiddleware } from "../controllers/imageController.js";

const router = express.Router();

// Route to upload an image for a specific patient
router.post('/:id', uploadMiddleware, uploadImage);

export const uploadRoutes = router;
