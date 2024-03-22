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

    const physician = await Physician.findById(id)

    if (!physician){
        return res.status(404).json({error: "No such physician"})
    }
    res.status(200).json(physician)
}


//create new physician
const createPhysician = async (req,res) =>{
    const{firstName,lastName,hospitalId,assignedPatientIds} = req.body
    //add to db
    try {
        const physician = await Physician.create({firstName,lastName,hospitalId,assignedPatientIds})
        res.status(200).json(physician)
    }
    catch(error ){
        res.status(400).json({error: error.message})
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
const updatePhysician = async (req,res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such physician"})
    }

    const physician = await Physician.findOneAndUpdate({_id: id}, {...req.body}, { new: true });


    if (!physician){
        return res.status(400).json({error: "No such physician"})
    }
    res.status(200).json(physician)
}

export {
    createPhysician,
    getPhysician,
    getPhysicians,
    deletePhysician,
    updatePhysician
}