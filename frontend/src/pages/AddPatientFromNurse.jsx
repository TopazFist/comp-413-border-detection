import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../components/api";
import "./Register.css";
import { Avatar, Box, Button, Container, Grid, TextField, Typography, ThemeProvider, createTheme } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// Create a default theme
const defaultTheme = createTheme();

/**
 * Component that adds a patient to a nurse's list of assigned patients.
 */
const AddPatientFromNurse = () => {
    // Extract nurse ID from route parameters
    const { id: nurseId } = useParams();
    const [patientId, setPatientId] = useState('');
    const [err, setError] = useState([]);

    /**
     * Handles the "Add Patient" form submission.
     * 
     * @param {Object} event - The form submission event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Retrieve nurse's data
            const nurseResponse = await api.get(`http://localhost:3001/nurses/${nurseId}`);
            const nurse = nurseResponse.data;

            // Check if the patient is a new patient
            if (!nurse.assignedPatientIds.includes(patientId)) {
                // Update nurse's assignedPatientIds
                const updatedAssignedPatientIds = [...nurse.assignedPatientIds, patientId];
                await api.patch(`http://localhost:3001/nurses/${nurseId}`, {
                    assignedPatientIds: updatedAssignedPatientIds
                });

                // Redirect to the nurse home page
                console.log("Patient added to nurse:", patientId);
                window.location.href = `/nurses/${nurseId}`;
            } else {
                setError("This patient is already assigned to this nurse.");
            }
        } catch (error) {
            console.error("Error adding patient to nurse:", error);
            setError("Failed to add patient. Please try again.");
        }
    };
    
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Add Patient
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="patientId"
                                    fullWidth
                                    id="patientId"
                                    required
                                    label="Patient ID"
                                    onClick={() => setError("")}
                                    autoFocus
                                    value={patientId}
                                    onChange={(event) => setPatientId(event.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Typography color="error">{err}</Typography>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add Patient
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default AddPatientFromNurse;
