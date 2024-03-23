import express from "express";

const router = express.Router()

import {
    createPhysician,
    getPhysician,
    getPhysicians,
    deletePhysician,
    updatePhysician
} from '../controllers/physicianController.js'

// gets all Physicians
router.get('/', getPhysicians)

router.get('/:id',getPhysician)

router.post('/', createPhysician)

router.delete('/:id', deletePhysician)

router.patch('/:id',updatePhysician)

// module.exports = router
export const physicianRoutes = router