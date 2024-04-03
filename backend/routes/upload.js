import express from "express";

const router = express.Router()

import { uploadImage, uploadMiddleware } from '../controllers/imageController.js'

// gets all patients
router.post('/:id', uploadMiddleware, uploadImage)

export const uploadRoutes = router;