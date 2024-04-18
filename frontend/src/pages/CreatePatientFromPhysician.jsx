import { useState } from 'react';
import { api } from "../components/api"
import { useParams } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import './Register.css'; // Import the CSS file
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider} from '@mui/material/styles';

const defaultTheme = createTheme();
const RegisterPatient = () => {
  const { id: personalPhysicianID } = useParams();
  const [err, setError] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      // Send registration data to the backend server
      const response = await api.post('/auth', {
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
      const physicianResponse = await api.get(`/physicians/${personalPhysicianID}`);
      const physician = physicianResponse.data;

      // // Update assignedPatientIds for the physician
      // const updatedAssignedPatientIds = [...physician.assignedPatientIds, response.data._id];
      // await api.patch(`/physicians/${personalPhysicianID}`, {
      //     assignedPatientIds: updatedAssignedPatientIds
      // });

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

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './Register.css'; // Import the CSS file
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { createTheme, ThemeProvider} from '@mui/material/styles';
// const defaultTheme = createTheme();

// const CreatePatientFromPhysican = () => {
//     const { id: personalPhysicianID } = useParams(); // Extracting physician ID from route parameters
//     const [err, setError] = useState([]);

//     const [newPatient, setNewPatient] = useState({
//         firstName: '',
//         lastName: '',
//         address: '',
//         phoneNumber: '',
//         gender: '',
//         age: '',
//         allergies: '',
//         physicianID: personalPhysicianID // Assigning the extracted physician ID
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewPatient(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             // Include physician ID in the request body
//             const response = await axios.post('http://localhost:3001/patients', {
//                 ...newPatient,
//                 physicianID: personalPhysicianID
//             });
//             const createdPatient = response.data;
    
//             // Fetch current physician's data
//             const physicianResponse = await axios.get(`http://localhost:3001/physicians/${personalPhysicianID}`);
//             const physician = physicianResponse.data;
    
//             // Update assignedPatientIds for the physician
//             const updatedAssignedPatientIds = [...physician.assignedPatientIds, createdPatient._id];
//             await axios.patch(`http://localhost:3001/physicians/${personalPhysicianID}`, {
//                 assignedPatientIds: updatedAssignedPatientIds
//             });
    
//             console.log('New patient created:', createdPatient);
//             window.location.href = `/physicians/${personalPhysicianID}`;
    
//             // Reset form fields or provide feedback to the user
//         } catch (error) {
//             console.error('Error creating new patient:', error);
//             // Handle errors
//             setError("Failed to register. Please try again.");
//         }
//     };
    
//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 8,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Register Patient
//           </Typography>
//           <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
//             <Grid container spacing={2}>
            
//               <Grid item xs={12}>
//                 <TextField
                
//                   autoComplete="given-first-name"
//                   name="firstName"
//                   fullWidth
//                   required
//                   id="firstName"
//                   label="First Name"
//                   onClick={() => setError("")}
//                   autoFocus
//                   value={newPatient.firstName || ''}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   autoComplete="given-last-name"
//                   name="lastName"
//                   fullWidth
//                   id="lastName"
//                   required
//                   label="Last Name"
//                   onClick={() => setError("")}
//                   autoFocus
//                   value={newPatient.lastName || ''}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
              
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   name="address"
//                   label="Address"
//                   required
//                   id="address"
//                   onClick={() => setError("")}
//                   value={newPatient.address || ''}
//                   autoComplete="address"
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   name="phoneNumber"
//                   label="Phone Number"
//                   required
//                   id="phoneNumber"
//                   value={newPatient.phoneNumber || ''}
//                   onClick={() => setError("")}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   name="age"
//                   label="Age"
//                   required
//                   id="age"
//                   value={newPatient.age || ''}
//                   onClick={() => setError("")}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   name="gender"
//                   label="Gender"
//                   required
//                   value={newPatient.gender || ''}
//                   onClick={() => setError("")}
//                   onChange={handleInputChange}
//                   id="gender"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   name="allergies"
//                   required
//                   label="Allergies"
//                   value={newPatient.allergies || ''}
//                   onClick={() => setError("")}
//                   onChange={handleInputChange}
//                   id="allergies"
//                 />
//               </Grid>
              
//             </Grid>
//             <Typography color="error">{err}</Typography>
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               onChange={handleInputChange}
//               sx={{ mt: 3, mb: 2 }}
//             >
//               Register Patient Information
//             </Button>
//           </Box>
//         </Box>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default CreatePatientFromPhysican;
