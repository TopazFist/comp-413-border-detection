import { useState } from "react";
import { api } from "../components/api";
import { useParams } from "react-router-dom";
import "./Register.css";
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// Create a default theme
const defaultTheme = createTheme();

/**
 * Component that adds a patient to a physician's list of assigned patients.
 */
const RegisterPatient = () => {
  // Extract physician ID from route parameters
  const { id: personalPhysicianID } = useParams();
  const [err, setError] = useState([]);

  /**
   * Handles the "Add Patient" form submission.
   * 
   * @param {Object} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    
    try {
      // Send registration data to the backend server
      await api.post('/auth', {
        username: data.get("username"),
        password: data.get("password"),
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        address: data.get("address"),
        phoneNumber: data.get("phoneNumber"),
        gender: data.get("gender"),
        age: data.get("age"),
        allergies: data.get("allergies"),
        physicianID: personalPhysicianID
      });

      // Update physician data after adding new patient
      await api.get(`/physicians/${personalPhysicianID}`);

      // Redirect to the physician home page
      window.location.href = `/physicians/${personalPhysicianID}`;
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
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  onClick={() => setError("")}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-first-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onClick={() => setError("")}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-last-name"
                  name="lastName"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  onClick={() => setError("")}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onClick={() => setError("")}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="address"
                  label="Address"
                  id="address"
                  onClick={() => setError("")}
                  autoComplete="address"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  id="phoneNumber"
                  onClick={() => setError("")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="age"
                  label="Age"
                  id="age"
                  onClick={() => setError("")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="gender"
                  label="Gender"
                  onClick={() => setError("")}
                  id="gender"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="allergies"
                  label="Allergies"
                  onClick={() => setError("")}
                  id="allergies"
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
              Register Patient
            </Button>
            
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterPatient;
