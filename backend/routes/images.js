import express from "express";

const router = express.Router()

import {
        getPatientImages,
        togglePublic,
        modifyNotes
} from '../controllers/imageController.js'

// gets all patients images
router.get('/:id', getPatientImages)

router.put('/:id/public', togglePublic)

router.put('/:id/notes', modifyNotes)

// module.exports = router
export const imageRoutes = router