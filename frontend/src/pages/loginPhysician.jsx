import { api } from "../components/api";
import { useState } from "react";
import { Avatar, Button, CssBaseline, Link, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// Create a default theme
const defaultTheme = createTheme();

/**
 * Component for physician login.
 */
const PhysicianLogin = () => {
  const [error, setError] = useState([]);

  /**
   * Handles the physician login form submission.
   * 
   * @param {Object} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      // Send login data to the backend server
      const response = await api.post(`/auth/physician/${data.get('username')}`, {password: data.get("password")});

      // Redirect to the physician home page after successful login
      window.location.href = `/physicians/${response.data.physicianId}`;
    } catch (error) {
      console.error('Login error:', error);
      setError("Failed to login. Please try again");
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
            Physician Login
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
            <Link href="/physicians/register">Register</Link>
          </Box>
        </Box>
        <Typography color="error">{error}</Typography>
      </Container>
    </ThemeProvider>
  );
};

export default PhysicianLogin;
