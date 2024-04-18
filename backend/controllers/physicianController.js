import {Physician} from '../models/physicianModel.js'
import mongoose from 'mongoose'

//get new Physician
const getPhysicians = async (req,res) => {
    const physicians = await Physician.find({}).sort({createdAt: -1})

    res.status(200).json(physicians)
}

//get single Physician
const getPhysician = async (req,res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such physician"})
    }

    const physician = await Physician.findOne({ _id: id });

    if (!physician){
        return res.status(404).json({error: "No such physician"})
    }
    res.status(200).json(physician)
}

const updateAssignedPatients = async (req, res) => {
    const { physicianId} = req.params; // Assuming physicianId is in params
    const { newPatientId: newPatientId } = req.body; // Assuming patientId is in body
  
    try {
      const physician = await Physician.findById(physicianId);
      if (!physician) {
        return res.status(404).json({ message: 'Physician not found' });
      }
      
  
      physician.assignedPatientIds.push(newPatientId);
  
      await physician.save();
  
      res.status(200).json({ message: 'Patient assigned to physician successfully' });
    } catch (error) {
      // Handle any errors
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  
  const removePatientFromPhysician = async (req, res) => {
    const { physicianId } = req.params; // Assuming physicianId is in params
    const { patientId: patientToRemove } = req.body; // Assuming patientId is in body
  
    try {
      // Update the physician document in the database
      const updatedPhysician = await Physician.findOneAndUpdate(
        { _id: physicianId },
        { $pull: { assignedPatientIds: patientToRemove } },
        { new: true }
      );
  
      // Check if the physician exists
      if (!updatedPhysician) {
        return res.status(404).json({ message: 'Physician not found' });
      }
  
      // Respond with success message
      res.status(200).json({ message: 'Patient removed from physician\'s list successfully' });
    } catch (error) {
      // Handle any errors
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  

//create new physician
const createPhysician = async (req,res) =>{
    const{firstName,lastName,hospitalId} = req.body
    console.log(assignedPatientIds);
    //add to db
    try {
        const physician = await Physician.create({firstName,lastName,hospitalId});
        res.status(200).json(physician);
    }
    catch(error ){
        res.status(400).json({error: error.message});
    }
}

//delete physician
const deletePhysician = async (req,res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such physician"})
    }

    const physician = await Physician.findOneAndDelete({_id: id})

    if (!physician){
        return res.status(400).json({error: "No such physician"})
    }
    res.status(200).json(physician)
}

//update physician data
const updatePhysician = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such physician" });
    }

    try {
        const updatedPhysician = await Physician.findOneAndUpdate(
            { _id: id },
            { $set: req.body }, // Use $set to update the fields provided in req.body
            { new: true }
        );

        if (!updatedPhysician) {
            return res.status(404).json({ error: "No such physician" });
        }

        console.log('Updated Physician:', updatedPhysician);
        res.status(200).json(updatedPhysician);
    } catch (error) {
        console.error('Error updating physician:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export {
    createPhysician,
    getPhysician,
    updateAssignedPatients,
    removePatientFromPhysician,
    getPhysicians,
    deletePhysician,
    updatePhysician
}