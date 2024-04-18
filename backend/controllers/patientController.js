import {Patient} from '../models/patientModel.js';
import mongoose from 'mongoose';
import { removePatientFromPhysician } from './physicianController.js'

//get new patient
const getPatients = async (req,res) => {
    const patients = await Patient.find({}).sort({createdAt: -1})

    res.status(200).json(patients)
}

//get single patient
const getPatient = async (req,res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such patient"})
    }

    const patient = await Patient.findById(id)
    if (!patient) {
        return res.status(404).json({error: "No such patient"})
    }

    const userId = req.session.uid;
    const userState = req.session.state;
    if (userId != patient.physicianID && userId != id && userState != "nurse") {
        console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
        return res.status(401).json({ message: 'Not Authorized'});
    }
    
    res.status(200).json(patient)
}


//create new patient
const createPatient = async (req,res) =>{
    const{firstName,lastName,address,phoneNumber,gender,age,allergies, physicianID} = req.body
    //add to db
    try {
        const patient = await Patient.create({firstName,lastName,address,phoneNumber,gender,age,allergies, physicianID})
        res.status(200).json(patient)
    }
    catch(error ){
        res.status(400).json({error: error.message})
    }
}

//delete Patient
const deletePatient = async (req,res) => {
    const {id} = req.params
   

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such patient"})
    }

    

    const patient = await Patient.findOneAndDelete({_id: id})

    if (!patient){
        return res.status(400).json({error: "No such patient"})
    }
    const mockResponse = createMockResponse();
    const mockUpdateRequest = {
        params: { physicianId: patient.physicianID.toString() },
        body: { patientId: id},
      };
    removePatientFromPhysician(mockUpdateRequest,mockResponse)
    res.status(200).json(patient)
}

//update patient data
const updatePatient = async (req,res) => {
    const {id} = req.params
    if (req.session.uid != id) {
        console.log("Unauthorized access for user. Session: " + JSON.stringify(req.session));
        return res.status(401).json({ message: 'Not Authorized'});
    }

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such patient"})
    }

    const patient = await Patient.findOneAndUpdate({_id: id}, {...req.body}, { new: true });

    if (!patient){
        return res.status(400).json({error: "No such patient"})
    }
    res.status(200).json(patient)
}

const createMockResponse = () => {
    let responseData = null;
    let statusCode = 200;
  
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      },
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