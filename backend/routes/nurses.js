import express from 'express';
import {
  getNurses,
  getNurse,
  createNurse,
  deleteNurse,
  updateNurse,
  assignPatientToNurse,
} from '../controllers/nurseController.js';

const router = express.Router();

router.get('/', getNurses);

router.get('/:id', getNurse);

router.post('/', createNurse);

router.delete('/:id', deleteNurse);

router.patch('/:id', updateNurse);

router.post('/assign-patient', assignPatientToNurse);

export const nurseRoutes = router