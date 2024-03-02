const express = require('express')

const router = express.Router()

const{
    createPhysician,
    getPhysician,
    getPhysicians,
    deletePhysician,
    updatePhysician
} = require('../controllers/physicianController')

// gets all Physicians
router.get('/', getPhysicians)

router.get('/:id',getPhysician)

router.post('/', createPhysician)

router.delete('/:id', deletePhysician)

router.patch('/:id',updatePhysician)

module.exports = router