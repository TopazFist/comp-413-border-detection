import {PatientImage, upload} from '../models/PatientImageModel.js';
import mongoose from 'mongoose';

//get new patient
const getPatientImages = async (req,res) => {
    console.log("i'm reaching this function");
    const {id} = req.params

    try {
        // Find patient images where patientId matches the id parameter
        const patientImages = await PatientImage.find({ patientId: id });
        
        // Return the list of patient images
        console.log(patientImages);
        console.log("above is on db end");
        res.status(200).json(patientImages);
    } catch (error) {
        // Handle errors
        console.error('Error fetching patient images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const uploadImage = (req, res) => {
    console.log('creating image...');
    const { id } = req.params;
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });
    } else {
        console.log("File received");
        PatientImage.create({
            patientId: id,
            s3image: "image-uploads/" + id + "/" + req.file.originalname
        });
        return res.send({
            file: req.file,
            success: true
        });
    }
}

const uploadMiddleware = upload.single("file");
const createImage = async (req, res) => {
        const{patientId, physicianNotes, isPublic, s3image, isBenign, benignProbability} = req.body
        //add to db
        try {
            const image = await PatientImage.create({patientId, physicianNotes, isPublic, s3image, isBenign, benignProbability})
            res.status(200).json(image)
        }
        catch(error){
            res.status(400).json({error: error.message})
        }
    }
    

export {
        getPatientImages,
        createImage,
        uploadImage,
        uploadMiddleware
}