import express from "express";

const router = express.Router()

import { uploadImage } from '../controllers/uploadImageController.js'

// gets all patients
router.get('/:id', uploadImage)

export const uploadRoutes = router;