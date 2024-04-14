import express from "express";

const router = express.Router()

import {
        getPatientImages,
        createImage,
        togglePublic
} from '../controllers/imageController.js'

// gets all patients images
router.get('/:id', getPatientImages)

router.post('/:id', createImage)

router.put('/:id/public', togglePublic)

// module.exports = router
export const imageRoutes = router