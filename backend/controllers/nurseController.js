import { Nurse } from '../models/nurseModel.js';
import mongoose from 'mongoose';

// Get all nurses
const getNurses = async (req, res) => {
  try {
    const nurses = await Nurse.find({}).sort({ createdAt: -1 });
    res.status(200).json(nurses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single nurse
const getNurse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such nurse' });
  }

  try {
    const nurse = await Nurse.findById(id);

    if (!nurse) {
      return res.status(404).json({ error: 'No such nurse' });
    }

    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create a new nurse
const createNurse = async (req, res) => {
  const { firstName, lastName, hospitalId } = req.body;

  try {
    const nurse = await Nurse.create({ firstName, lastName, hospitalId });
    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a nurse
const deleteNurse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such nurse' });
  }

  try {
    const nurse = await Nurse.findOneAndDelete({ _id: id });

    if (!nurse) {
      return res.status(404).json({ error: 'No such nurse' });
    }

    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a nurse
const updateNurse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such nurse' });
  }

  try {
    const nurse = await Nurse.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });

    if (!nurse) {
      return res.status(404).json({ error: 'No such nurse' });
    }

    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Assign a patient to a nurse
const assignPatientToNurse = async (req, res) => {
  const { nurseId, patientId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(nurseId) || !mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(404).json({ error: 'Invalid IDs' });
  }

  try {
    const nurse = await Nurse.findById(nurseId);

    if (!nurse) {
      return res.status(404).json({ error: 'No such nurse' });
    }

    nurse.assignedPatientIds.push(patientId);
    await nurse.save();

    res.status(200).json(nurse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getNurses, getNurse, createNurse, deleteNurse, updateNurse, assignPatientToNurse };