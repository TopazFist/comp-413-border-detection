import React, { useState, useEffect } from "react";
import { api } from "../components/api";
import { useParams } from "react-router-dom";
import "./Register.css";
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// Create a default theme
const defaultTheme = createTheme();

/**
 * Component that updates patient profile information.
 */
const PatientProfile = () => {
  // Extract patient ID from route parameters
  const { id } = useParams();

  // Initialize as an empty object
  const [err, setError] = useState([]);
  const [editedPatient, setEditedPatient] = useState({});
  const [physician, setPatient] = useState(null);

  /**
   * Retrieve patient data.
   */
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/patients/${id}`);
        setPatient(response.data);
        setEditedPatient(response.data);
      } catch (error) {
        console.log("Error fetching physician:", error);
      }
    };

    fetchPatient();
  }, [id]);

  /**
   * Handle input change for form fields.
   * 
   * @param {Object} e - The event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assignedPatientIds') {
      // Handle assignedPatientIds separately to prevent unintended modifications
      setEditedPatient(prevState => ({
        ...prevState,
        assignedPatientIds: value.split(',') // Assuming assignedPatientIds is a comma-separated list
      }));
    } else {
      // Update other fields as usual
      setEditedPatient(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  /**
   * Handle form submission.
   * 
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      await api.patch(`/patients/${id}`, editedPatient);
      const response = await api.get(`/patients/${id}`);

      // Update the physician state with the updated information
      setPatient(response.data);

      // Redirect to the login page after successful registration
      console.log('Update successful:', response.data);
      window.location.href = `/patients/${id}`;
    } catch (error) {
      console.error('Update error:', error);
      setError("Failed to update. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Update Patient
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-first-name"
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onClick={() => setError("")}
                  autoFocus
                  value={editedPatient.firstName || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-last-name"
                  name="lastName"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  onClick={() => setError("")}
                  autoFocus
                  value={editedPatient.lastName || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  id="address"
                  onClick={() => setError("")}
                  value={editedPatient.address || ''}
                  autoComplete="address"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  id="phoneNumber"
                  value={editedPatient.phoneNumber || ''}
                  onClick={() => setError("")}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="age"
                  label="Age"
                  id="age"
                  value={editedPatient.age || ''}
                  onClick={() => setError("")}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="gender"
                  label="Gender"
                  value={editedPatient.gender || ''}
                  onClick={() => setError("")}
                  onChange={handleInputChange}
                  id="gender"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="allergies"
                  label="Allergies"
                  value={editedPatient.allergies || ''}
                  onClick={() => setError("")}
                  onChange={handleInputChange}
                  id="allergies"
                />
              </Grid>
              
            </Grid>
            <Typography color="error">{err}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onChange={handleInputChange}
              sx={{ mt: 3, mb: 2 }}
            >
              Update Patient Information
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PatientProfile;
