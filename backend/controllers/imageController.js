import {PatientImage} from '../models/PatientImageModel.js';
import mongoose from 'mongoose';

//get new patient
const getPatientImages = async (req,res) => {
    const {id} = req.params

    try {
        // Find patient images where patientId matches the id parameter
        const patientImages = await PatientImage.find({ patientId: id });
        
        // Return the list of patient images
        res.status(200).json(patientImages);
    } catch (error) {
        // Handle errors
        console.error('Error fetching patient images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export {
        getPatientImages
}