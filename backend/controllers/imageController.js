import {PatientImage, upload} from '../models/PatientImageModel.js';
import { spawn } from "node:child_process";
import mongoose from 'mongoose';
import { Patient } from '../models/patientModel.js';

const pythonProcess = spawn('python3', ['./classification/model.py']);
pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString().trim());
    data = JSON.parse(data.toString().trim());
    if (data.hasOwnProperty('path') && data.hasOwnProperty('malignant_prob') && data.hasOwnProperty('id')) {
        PatientImage.create({
            patientId: data.id,
            s3image: data.path,
            benignProbability: data.malignant_prob
        });
    } else {
        console.error(data);
    }
});
pythonProcess.stderr.on('data', (data) => {
    console.log(data.toString());
});
pythonProcess.on('exit', (code, signal) => {
    console.log("CLOSED!!")
})
pythonProcess.on('close', (code, signal) => {
    console.log("CLOSED!!")
})

const pythonProcess2 = spawn('python3', ['./border-detection/run.py']);

// Handle output data from the Python script
pythonProcess2.stdout.on('data', async (data) => {
    console.log(data.toString().trim()); // Log output from the Python script
    const jsonData = JSON.parse(data.toString().trim());

    const { patientID, existingPath, borderDetectionPath } = jsonData;

    if (patientID && existingPath && borderDetectionPath) {
        try {
            // Perform MongoDB update
            const updatedImage = await PatientImage.findOneAndUpdate(
                { patientId: patientID, s3image: existingPath }, // Filter criteria
                { borderDetectionPath: borderDetectionPath }, // Update to be applied
                { new: true } // Options: return the modified document
            ).exec();

            console.log('Updated patient image:', updatedImage);
            // Handle updated image
        } catch (err) {
            console.error(err);
            // Handle error
        }
    } else {
        console.error(data);
    }
});

pythonProcess2.stderr.on('data', (data) => {
    console.error(data.toString()); // Log errors from the Python script
});

pythonProcess2.on('exit', (code, signal) => {
    console.log("Image processing script process CLOSED!!")
});
pythonProcess2.on('close', (code, signal) => {
    console.log("Image processing script process CLOSED!!")
});

//get new patient
const getPatientImages = async (req,res) => {
    console.log("i'm reaching this function");
    const {id} = req.params

    const patient = await Patient.findById(id)

    if (req.session.uid != id && (patient && req.session.uid != patient.physicianID)) {
        console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
        return res.status(401).json({ message: 'Not Authorized'});
    }

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
    const patient = Patient.findById(id)

    if (req.session.uid != id && (patient && req.session.uid != patient.physicianID)) {
        console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
        return res.status(401).json({ message: 'Not Authorized'});
    }
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });
    } else {
        console.log("File received");
        
        console.log(req.file.originalname);
        PatientImage.create({
            patientId: id,
            s3image: "image-uploads/" + id + "/" + req.file.originalname
        });
        pythonProcess.stdin.write("image-uploads/" + id + "/" + req.file.originalname + "\n"); // Sends to model process
        pythonProcess2.stdin.write("image-uploads/" + id + "/" + req.file.originalname + "\n"); // Sends to model process

        return res.send({
            file: req.file,
            success: true
        });
    }
}

const uploadMiddleware = upload.single("file");

const togglePublic = async (req, res) => {
        const { id } = req.params;
        const { isPublic } = req.body;

        const patient = await Patient.findById(id)

        if (req.session.uid != id && (patient && req.session.uid != patient.physicianID)) {
                console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
            return res.status(401).json({ message: 'Not Authorized'});
        }
      
        try {
          // Find the patient image by ID
          const patientImage = await PatientImage.findById(id);
      
          if (!patientImage) {
            return res.status(404).json({ error: 'Patient image not found' });
          }
      
          // Update the isPublic field
          patientImage.isPublic = isPublic;
      
          // Save the updated patient image
          await patientImage.save();
      
          res.json({ success: true, message: 'Public field toggled successfully' });
          console.log(patientImage);
        } catch (error) {
          console.error('Error toggling public field:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
      
const modifyNotes = async (req, res) => {
        const { id } = req.params;
        const { physicianNotes } = req.body;

        const patient = await Patient.findById(id)

        if (req.session.uid != id && (patient && req.session.uid != patient.physicianID)) {
                console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
            return res.status(401).json({ message: 'Not Authorized'});
        }
    
        try {
            // Find the patient image by ID
            const patientImage = await PatientImage.findById(id);
    
            if (!patientImage) {
                return res.status(404).json({ error: 'Patient image not found' });
            }
    
            // Update the physicianNotes field
            patientImage.physicianNotes = physicianNotes;
    
            // Save the updated patient image
            await patientImage.save();
    
            res.json({ success: true, message: 'Physician notes updated successfully' });
            console.log(patientImage);
        } catch (error) {
            console.error('Error updating physician notes:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    

export {
        getPatientImages,
        uploadImage,
        uploadMiddleware,
        togglePublic,
        modifyNotes
}