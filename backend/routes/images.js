import express from "express";

const router = express.Router()

import {
        getPatientImages
} from '../controllers/imageController.js'

// gets all patients images
router.get('/:id', getPatientImages)

// module.exports = router
export const imageRoutes = router