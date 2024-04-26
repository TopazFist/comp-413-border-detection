import { api } from "../components/api";
import { useState } from "react";
import { Avatar, Button, CssBaseline, Link, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// Create a default theme
const defaultTheme = createTheme();

/**
 * Component for patient login.
 */
const Login = () => {
  const [err, setError] = useState([]);

  /**
   * Handles the patient login form submission.
   * 
   * @param {Object} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      // Send login data to the backend server
      const response = await api.post(`/auth/patient/${data.get('username')}`, {password: data.get("password")});
      
      // Redirect to the patient home page after successful login
      window.location.href = `/patients/${response.data.patientId}`;
    } catch (error) {
      console.error('Login error:', error);
      setError("Failed to log in. Please try again.");
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
            Patient Login
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
                  onClick={() => setError("")}
                  label="Username"
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Link href="/patients/register">Register</Link>
          </Box>
        </Box>
        <Typography color="error">{err}</Typography>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
