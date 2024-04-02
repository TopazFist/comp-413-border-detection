import express from "express";

const router = express.Router()

import {
    createPatient,
    getPatient,
    getPatients,
    getPatientImages,
    deletePatient,
    updatePatient
} from '../controllers/patientController.js'

// gets all patients
router.get('/', getPatients)

router.get('/:id',getPatient)

router.post('/', createPatient)

router.delete('/:id', deletePatient)

router.patch('/:id',updatePatient)

// module.exports = router
export const patientRoutes = router