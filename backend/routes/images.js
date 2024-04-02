import express from "express";

const router = express.Router()

import {
        getPatientImages,
        createImage
} from '../controllers/imageController.js'

// gets all patients images
router.get('/:id', getPatientImages)

router.post('/:id', createImage)

// module.exports = router
export const imageRoutes = router