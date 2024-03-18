const express = require('express')

const router = express.Router()

const{
    createPatient,
    getPatient,
    getPatients,
    deletePatient,
    updatePatient
} = require('../controllers/patientController')

// gets all patients
router.get('/', getPatients)

router.get('/:id',getPatient)

router.post('/', createPatient)

router.delete('/:id', deletePatient)

router.patch('/:id',updatePatient)

module.exports = router