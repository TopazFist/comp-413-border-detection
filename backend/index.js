// Serves as the entry point for the application.

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import { PORT, mongoDBURL } from "./config.js";
import { patientRoutes } from "./routes/patients.js";
import { physicianRoutes } from "./routes/physicians.js";
import { authRoutes } from "./routes/auth.js";
import { imageRoutes } from "./routes/images.js";
import { uploadRoutes } from "./routes/upload.js"
import { nurseRoutes } from "./routes/nurses.js";

const PRODUCTION = false;

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy
const corsOptions = {
    // Allow credentials (cookies)
    credentials: true,
    origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));

// Session configuration
const secret = "comp413";
if (PRODUCTION) {
    // Use the SECRET environment variable in production
    secret = process.env.SECRET;
}
app.use(session({
    // Encryption
    secret: secret,
    // Only saves when modified
    resave: false,
    // Avoid saving empty sessions
    saveUninitialized: false,
    // 30 minutes session duration (1.8M milliseconds)
    cookie: { maxAge: 1_800_000 }
}))

// Serve uploaded images statically
app.use("/image-uploads", express.static("image-uploads"));

// Test route
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send("hi!");
});




// Debugging middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.path}`);
    next();
});

// Routes setup
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/physicians', physicianRoutes);
app.use('/nurses', nurseRoutes);
app.use('/images', imageRoutes);
app.use('/upload', uploadRoutes);

// Connect to MongoDB database
mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database");
        // Start the server
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

export { app };