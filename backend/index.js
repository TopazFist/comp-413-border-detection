import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import { PORT, mongoDBURL } from "./config.js";

import {patientRoutes} from "./routes/patients.js";
import {physicianRoutes} from "./routes/physicians.js";
import {authRoutes} from "./routes/auth.js";
import { imageRoutes } from "./routes/images.js";
import { uploadRoutes } from "./routes/upload.js"

const PRODUCTION = false;

const app = express();

// middleware for parsing request body
app.use(express.json());

// middleware for handling cors policy
// it would be better to customize - do this later if necessary
const corsOptions = {
    credentials: true, // Allow credentials (cookies)
    origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));

const secret = "comp413";
if (PRODUCTION) {
    secret = process.env.SECRET // Gets the SECRET environment variable
}
app.use(session({
    secret: secret, // for encryption
    resave: false, // only saves when modified
    saveUninitialized: false, // avoid saving empty sessions
    cookie: { maxAge: 1_800_000 } // session lasts 30 mins from inactivity (1.8M milliseconds)
}))
app.use("/image-uploads", express.static("image-uploads"));

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

app.use('/images', imageRoutes)


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

app.use("/upload", uploadRoutes);
