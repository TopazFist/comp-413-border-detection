// Controller functions for handling patient operations.

import { Patient } from "../models/patientModel.js";
import mongoose from "mongoose";
import { removePatientFromPhysician } from "./physicianController.js";

/**
 * Retrieve all patients.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getPatients = async (req, res) => {
    // Fetch all patients from the database and sort them by createdAt field in descending order
    const patients = await Patient.find({}).sort({ createdAt: -1 });

    // Send the list of patients as a JSON response
    res.status(200).json(patients);
}

/**
 * Retrieve a single patient by ID.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getPatient = async (req,res) => {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such patient"})
    }

    // Find the patient by ID in the database
    const patient = await Patient.findById(id);
    if (!patient) {
        return res.status(404).json({error: "No such patient"})
    }

    // Check authorization for accessing the patient's data
    const userId = req.session.uid;
    const userState = req.session.state;
    if (userId != patient.physicianID && userId != id && userState != "nurse") {
        console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
        return res.status(401).json({ message: 'Not Authorized'});
    }
    
    // Send the patient data as a JSON response
    res.status(200).json(patient);
}

/**
 * Create a new patient.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createPatient = async (req,res) => {
    // Extract patient data from the request body
    const { firstName, lastName, address, phoneNumber, gender, age, allergies, physicianID} = req.body;

    // Attempt to add the patient to the database
    try {
        // Create a new patient entry in the database
        const patient = await Patient.create({firstName, lastName, address, phoneNumber, gender, age, allergies, physicianID});
        
        // Send the newly created patient data as a JSON response
        res.status(200).json(patient);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Delete a patient.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deletePatient = async (req, res) => {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such patient"});
    }
    
    // Find the patient by ID from the database
    const patient = await Patient.findOneAndDelete({_id: id});
    if (!patient) {
        return res.status(400).json({error: "No such patient"});
    }

    // Remove the patient from the associated physician
    const mockResponse = createMockResponse();
    const mockUpdateRequest = {
        params: { physicianId: patient.physicianID.toString() },
        body: { patientId: id},
    };
    removePatientFromPhysician(mockUpdateRequest, mockResponse);

    // Send a success response with the deleted patient data
    res.status(200).json(patient);
}

/**
 * Update patient data.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updatePatient = async (req, res) => {
    const { id } = req.params;

    // Check if the user has authorization to update this patient's data
    if (req.session.uid != id) {
        console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
        return res.status(401).json({ message: 'Not Authorized'});
    }

    // Check if the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such patient"});
    }

    // Find the patient by ID in the database
    const patient = await Patient.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
    if (!patient) {
        return res.status(400).json({error: "No such patient"});
    }

    // Send a success response with the updated patient data
    res.status(200).json(patient);
}

/**
 * Create a mock response object for testing.
 * 
 * @returns {Object} - Mock response object.
 */
const createMockResponse = () => {
    let responseData = null;
    let statusCode = 200;
  
    const res = {
        // Set the status code of the response.
        status(code) {
            statusCode = code;
            return this;
        },
        // Set the JSON response data.
        json(data) {
            responseData = data;
            return this;
        },
        // Get the response data.
        send() {
            return responseData;
        },
    };
    
    return res;
};

export {
    createPatient,
    getPatient,
    getPatients,
    deletePatient,
    updatePatient
}
