import express from "express";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import { Physician } from "./models/physicianModel.js";
import { Patient } from "./models/patientModel.js";
import { PatientImage } from "./models/PatientImage.js";
import { ImageProcessing } from "./models/ImageProcessing.js";

import {patientRoutes} from "./routes/patients.js";
import {physicianRoutes} from "./routes/physicians.js";

const app = express();

// middleware for parsing request body
app.use(express.json());

// middleware for handling cors policy
// it would be better to customize - do this later if necessary
app.use(cors());

app.get('/', (request, response) => {
        console.log(request);
        return response.status(234).send("hi!");
});

// Routes
app.use('/patients',patientRoutes)

app.use('/physicians',physicianRoutes)

// Connecting the database
mongoose.connect(mongoDBURL)
        .then(()=> {
                console.log("App connected to database");
                app.listen(PORT, () => {
                        console.log(`App is listening to port: ${PORT}`);
                })
        })
        .catch((error)=>{
                console.log(error);
        })
      