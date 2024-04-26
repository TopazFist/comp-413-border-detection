import React, { useState, useEffect } from "react";
import { api } from "../components/api";
import { useParams } from "react-router-dom";
import "./Register.css";
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// Create a default theme
const defaultTheme = createTheme();

/**
 * Component that updates physician profile information.
 */
const PhysicianProfile = () => {
  // Extract physician ID from route parameters
  const { id } = useParams();

  // Initialize as an empty object
  const [err, setError] = useState([]);
  const [editedPhysician, setEditedPhysician] = useState({});
  const [physician, setPhysician] = useState(null);

  /**
   * Retrieve physician data.
   */
  useEffect(() => {
    const fetchPhysician = async () => {
      try {
        const response = await api.get(`/physicians/${id}`);
        setPhysician(response.data);
        setEditedPhysician(response.data);
      } catch (error) {
        console.log("Error fetching physician:", error);
      }
    };

    fetchPhysician();
  }, [id]);

  /**
   * Handle input change for form fields.
   * 
   * @param {Object} e - The event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assignedPhysicianIds') {
      // Handle assignedPhysicianIds separately to prevent unintended modifications
      setEditedPhysician(prevState => ({
        ...prevState,
        assignedPhysicianIds: value.split(',') // Assuming assignedPhysicianIds is a comma-separated list
      }));
    } else {
      // Update other fields as usual
      setEditedPhysician(prevState => ({
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
      await api.patch(`/physicians/${id}`, editedPhysician);

      // Retrieve the updated physician information after successful update
      const response = await api.get(`/physicians/${id}`);
        
      // Update the physician state with the updated information
      setPhysician(response.data);

      // Redirect to the login page after successful registration
      console.log('Update successful:', response.data);
      window.location.href = `/physicians/${id}`;
    } catch (error) {
      console.error('Update error:', error);
      setError("Failed to Update. Please try again.");
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
          Update Physician
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
                  value={editedPhysician.firstName || ''}
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
                  value={editedPhysician.lastName || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="hospitalID"
                  label="hospitalID"
                  id="hospitalID"
                  onClick={() => setError("")}
                  value={editedPhysician.hospitalId || ''}
                  autoComplete="hospitalID"
                  onChange={handleInputChange}
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
              Update Physician Information
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PhysicianProfile;
