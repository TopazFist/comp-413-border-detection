import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, mongoDBURL } from "./config.js";
import { Physician } from "./models/physicianModel.js";
import { Patient } from "./models/patientModel.js";
import { PatientImage } from "./models/PatientImage.js";
import { ImageProcessing } from "./models/ImageProcessing.js";

import {patientRoutes} from "./routes/patients.js";
import {physicianRoutes} from "./routes/physicians.js";
import {authRoutes} from "./routes/auth.js";

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

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
        console.log(`Received ${req.method} request at ${req.path}`);
        next();
    });
// Routes
app.use('/patients',patientRoutes)

app.use('/physicians',physicianRoutes)

app.use('/auth', authRoutes)
// app.use('/sign-up',signupRoute)


// Connecting the database
// mongoose.connect(mongoDBURL)
//         .then(()=> {
//                 console.log("App connected to database");
//                 app.listen(PORT, () => {
//                         console.log(`App is listening to port: ${PORT}`);
//                 })
//         })
//         .catch((error)=>{
//                 console.log(error);
//         })
      
mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        })
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
        process.exit(1); // Exit the process if unable to connect to the database
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});