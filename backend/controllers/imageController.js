// Controller functions for handling patient image upload, processing, and retrieval.

import { PatientImage, upload } from "../models/PatientImageModel.js";
import { spawn } from "node:child_process";
import { Patient } from "../models/patientModel.js";

// Python process for classification model
const pythonProcess = spawn('python3', ['./classification/model.py']);
pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString().trim());
    data = JSON.parse(data.toString().trim());
    if (data.hasOwnProperty('path') && data.hasOwnProperty('malignant_prob') && data.hasOwnProperty('id')) {
        // Create a new patient image entry in the database
        PatientImage.create({
            patientId: data.id,
            s3image: data.path,
            benignProbability: 1.0 - data.malignant_prob,
            isBenign: data.malignant_prob < 0.5,
            heatmapPath: data.heatmap_path
        });
    } else {
        console.error(data);
    }
});
pythonProcess.stderr.on('data', (data) => {
    // Log errors from the Python script
    console.log(data.toString());
});
pythonProcess.on('exit', (code, signal) => {
    console.log("CLOSED!!")
})
pythonProcess.on('close', (code, signal) => {
    console.log("CLOSED!!")
})

// Python process for border detection
const pythonProcess2 = spawn('python3', ['./border-detection/run.py']);

// Handle output data from the Python script
pythonProcess2.stdout.on('data', async (data) => {
    // Log output from the Python script
    console.log(data.toString().trim());
    const jsonData = JSON.parse(data.toString().trim());
    const { patientID, existingPath, borderDetectionPath } = jsonData;

    if (patientID && existingPath && borderDetectionPath) {
        try {
            // Update the border detection path for the corresponding patient image
            const updatedImage = await PatientImage.findOneAndUpdate(
                // Filter criteria
                { patientId: patientID, s3image: existingPath },
                // Update to be applied
                { borderDetectionPath: borderDetectionPath },
                // Options: return the modified document
                { new: true }
            ).exec();

            console.log('Updated patient image:', updatedImage);
        } catch (err) {
            console.error(err);
        }
    } else {
        console.error(data);
    }
});

pythonProcess2.stderr.on('data', (data) => {
    // Log errors from the Python script
    console.error(data.toString());
});
pythonProcess2.on('exit', (code, signal) => {
    console.log("Image processing script process CLOSED!!")
});
pythonProcess2.on('close', (code, signal) => {
    console.log("Image processing script process CLOSED!!")
});

/**
 * Get patient images based on the user's state.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getPatientImages = async (req,res) => {
    const { id } = req.params;

    try {
        let patientImages;

        // Determine the user's state from the session
        const userState = req.session.state;

        if (userState == "patient" | userState == "physician") {
            // Retrieve all patient images where patientId matches the id parameter
            patientImages = await PatientImage.find({ patientId: id });
        } else if (userState == "nurse") {
            // Retrieve only public images for the specified patient ID
            patientImages = await PatientImage.find({ patientId: id, isPublic: true });
        } else {
            // Unauthorized if the user does not have a recognized state
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        // Return the list of patient images
        console.log(patientImages);
        res.status(200).json(patientImages);
    } catch (error) {
        console.error('Error fetching patient images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Upload a patient image.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const uploadImage = (req, res) => {
    const { id } = req.params;

    // Check if a file was received in the request
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });
    } else {
        console.log("File received");
        
        // Sends to classification model process
        pythonProcess.stdin.write("image-uploads/" + id + "/" + req.file.originalname + "\n");
        // Sends to border detection model process
        pythonProcess2.stdin.write("image-uploads/" + id + "/" + req.file.originalname + "\n");

        // Send response indicating success
        return res.send({
            file: req.file,
            success: true
        });
    }
}

// Middleware for uploading images.
const uploadMiddleware = upload.single("file");

/**
 * Toggle the public status of a patient image.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const togglePublic = async (req, res) => {
    const { id } = req.params;
    const { isPublic } = req.body;

    // Find the patient in the database
    const patient = await Patient.findById(id)

    // Check if the user is authorized to modify the public status
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
    
        // Send success response
        res.json({ success: true, message: 'Public field toggled successfully' });
        console.log(patientImage);
    } catch (error) {
        console.error('Error toggling public field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Modify physician notes for a patient image.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const modifyNotes = async (req, res) => {
    const { id } = req.params;
    const { physicianNotes } = req.body;

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

        // Send success response
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
