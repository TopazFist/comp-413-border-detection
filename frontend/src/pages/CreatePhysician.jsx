import { useState } from "react";
import { api } from "../components/api";
import "./Register.css";
import { Avatar, Button, CssBaseline, Link, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// Create a default theme
const defaultTheme = createTheme();

/**
 * Component that registers a physician with the system.
 */
const PhysicianRegister = () => {
  const [err, setError] = useState([]);

  /**
   * Handles the "Register Physician" form submission.
   * 
   * @param {Object} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      // Send registration data to the backend server
      const response = await api.post('/auth/physician', {
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        hospitalId: data.get("hospitalID"),
        username: data.get("username"),
        password: data.get("password")
      });

      // Redirect to the login page after successful registration
      console.log('Registration successful:', response.data);
      window.location.href = `/physicians/login`;
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
            Register Physician
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
                  name="hospitalID"
                  label="Hospital ID"
                  onClick={() => setError("")}
                  id="hospitalID"
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
            </Grid>
            <Typography color="error">{err}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register Physician
            </Button>
            <Link href="/physicians/login">Back to login</Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PhysicianRegister;
