import {Patient} from '../models/patientModel.js';
import mongoose from 'mongoose';

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

    if (!patient){
        return res.status(404).json({error: "No such patient"})
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
    res.status(200).json(patient)
}

//update patient data
const updatePatient = async (req,res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such patient"})
    }

    const patient = await Patient.findOneAndUpdate({_id: id}, {...req.body}, { new: true });


    if (!patient){
        return res.status(400).json({error: "No such patient"})
    }
    res.status(200).json(patient)
}

export {
    createPatient,
    getPatient,
    getPatients,
    deletePatient,
    updatePatient
}