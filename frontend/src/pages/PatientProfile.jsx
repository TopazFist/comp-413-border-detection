import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Import the CSS file
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider} from '@mui/material/styles';
const defaultTheme = createTheme();


const PatientProfile = () => {
  const { id } = useParams();
  const [err, setError] = useState([]);
  const [editedPatient, setEditedPatient] = useState({}); // Initialize as an empty object

  const [physician, setPatient] = useState(null);
  useEffect(() => {
    const fetchPatient = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/patients/${id}`);
            setPatient(response.data);
            setEditedPatient(response.data);
        } catch (error) {
            console.log("Error fetching physician:", error);
            // Handle error
        }
    };

    fetchPatient();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      await axios.patch(`http://localhost:3001/patients/${id}`, editedPatient);
      const response = await axios.get(`http://localhost:3001/patients/${id}`);
            setPatient(response.data); // Update the physician state with the updated information
      // Redirect to the login page after successful registration
      console.log('Registration successful:', response.data);
      window.location.href = `/patients/${id}`;
    } catch (error) {
      console.error('Registration error:', error);
      setError("Failed to register. Please try again.");
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
            Register Patient
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
              Register Patient
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PatientProfile;