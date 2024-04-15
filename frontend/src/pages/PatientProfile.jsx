import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Import the CSS file
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider} from '@mui/material/styles';

const defaultTheme = createTheme();

const Profile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [err, setError] = useState('');

  useEffect(() => {
    // Fetch user data from the backend when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/patients/${id}`); // Endpoint to fetch user data
        setUserData(response.data); // Assuming response.data contains user information
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      // Send updated user data to the backend server
      await axios.patch(`http://localhost:3001/patients/${id}`, {
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        address: data.get('address'),
        phoneNumber: data.get('phoneNumber'),
        gender: data.get('gender'),
        age: data.get('age'),
        allergies: data.get('allergies'),
      });

      const response = await axios.get(`http://localhost:3001/patients/${id}`);
      setUserData(response.data);

      console.log('Registration successful:', response.data);
      window.location.href = `/patients/login`;
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to update user data. Please try again.');
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
            Edit Profile
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
                  defaultValue={userData.firstName || ''}
                  onClick={() => setError('')}
                  onChange={handleInputChange}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-last-name"
                  name="lastName"
                  
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  defaultValue={userData.lastName || ''}
                  onClick={() => setError('')}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  
                  fullWidth
                  name="address"
                  label="Address"
                  id="address"
                  defaultValue={userData.address || ''}
                  onClick={() => setError('')}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  id="phoneNumber"
                  defaultValue={userData.phoneNumber || ''}
                  onClick={() => setError('')}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  
                  fullWidth
                  name="age"
                  label="Age"
                  id="age"
                  defaultValue={userData.age || ''}
                  onClick={() => setError('')}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  
                  fullWidth
                  name="gender"
                  label="Gender"
                  id="gender"
                  defaultValue={userData.gender || ''}
                  onClick={() => setError('')}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  
                  fullWidth
                  name="allergies"
                  label="Allergies"
                  id="allergies"
                  defaultValue={userData.allergies || ''}
                  onClick={() => setError('')}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Typography color="error">{err}</Typography>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Update Profile
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Profile;

// const defaultTheme = createTheme();
// const PatientProfile = () => {
//     const { id } = useParams();
//     const [patient, setPatient] = useState(null);
//     const [editedPatient, setEditedPatient] = useState({});

    // useEffect(() => {
    //     const fetchPatient = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:3001/patients/${id}`);
    //             setPatient(response.data);
    //             setEditedPatient(response.data);
    //         } catch (error) {
    //             console.log("Error fetching patient:", error);
    //             // Handle error
    //         }
    //     };

    //     fetchPatient();
    // }, [id]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         // if (name === 'assignedPhysicianIds') {
//         //     setEditedPatient(prevState => ({
//         //         ...prevState,
//         //         assignedPhysicianIds: value.split(',')
//         //     }));
//         // } else {
//             setEditedPatient(prevState => ({
//                 ...prevState,
//                 [name]: value
//             }));
//         // }
//     };
    
//     const handleSubmit = async () => {
//         try {
//             await axios.patch(`http://localhost:3001/patients/${id}`, editedPatient);
            // const response = await axios.get(`http://localhost:3001/patients/${id}`);
            // setPatient(response.data);
//             alert('Patient information updated successfully!');
//         } catch (error) {
//             console.error('Error updating patient information:', error);
//             alert('Failed to update patient information. Please try again.');
//             setError("Failed to register. Please try again.");
//         }
//     };
    

//     return (
//         <ThemeProvider theme={defaultTheme}>
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
//             <Grid item xs={12}>
//                 <TextField
//                   autoComplete="given-name"
//                   name="username"
//                   required
//                   fullWidth
//                   id="username"
//                   label="Username"
//                   onClick={() => setError("")}
//                   autoFocus
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   autoComplete="given-first-name"
//                   name="firstName"
//                   required
//                   fullWidth
//                   id="firstName"
//                   label="First Name"
//                   onClick={() => setError("")}
//                   autoFocus
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   autoComplete="given-last-name"
//                   name="lastName"
//                   required
//                   fullWidth
//                   id="lastName"
//                   label="Last Name"
//                   onClick={() => setError("")}
//                   autoFocus
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   name="password"
//                   label="Password"
//                   type="password"
//                   id="password"
//                   onClick={() => setError("")}
//                   autoComplete="new-password"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   name="address"
//                   label="Address"
//                   id="address"
//                   onClick={() => setError("")}
//                   autoComplete="address"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   name="phoneNumber"
//                   label="Phone Number"
//                   id="phoneNumber"
//                   onClick={() => setError("")}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   name="age"
//                   label="Age"
//                   id="age"
//                   onClick={() => setError("")}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   name="gender"
//                   label="Gender"
//                   onClick={() => setError("")}
//                   id="gender"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   name="allergies"
//                   label="Allergies"
//                   onClick={() => setError("")}
//                   id="allergies"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   name="physicianID"
//                   label="Physician ID"
//                   onClick={() => setError("")}
//                   id="physicianID"
//                 />
//               </Grid>
//             </Grid>
//             <Typography color="error">{err}</Typography>
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//             >
//               Register Patient
//             </Button>
//           </Box>
//         </Box>
//       </Container>
//     </ThemeProvider>
//     //     <div>
//     //         <h1>Edit Profile</h1>
//     //         {editedPatient && (
//     //             <div>
//     //                 <label>
//     //                     First Name:
//     //                     <input
//     //                         type="text"
//     //                         name="firstName"
//     //                         value={editedPatient.firstName || ''}
//     //                         onChange={handleInputChange}
//     //                     />
//     //                 </label>
//     //                 <br />
//     //                 <label>
//     //                     Last Name:
//     //                     <input
//     //                         type="text"
//     //                         name="lastName"
//     //                         value={editedPatient.lastName || ''}
//     //                         onChange={handleInputChange}
//     //                     />
//     //                 </label>
//     //                 <br />
//     //                 <label>
//     //                     Address:
//     //                     <input
//     //                         type="text"
//     //                         name="address"
//     //                         value={editedPatient.address || ''}
//     //                         onChange={handleInputChange}
//     //                     />
//     //                 </label>
//     //                 <br />
//     //                 <label>
//     //                 Phone Number:
//     //                     <input
//     //                         type="text"
//     //                         name="phoneNumber"
//     //                         value={editedPatient.phoneNumber || ''}
//     //                         onChange={handleInputChange}
//     //                         pattern="[0-9]*" 
//     //                     />
//     //                 </label>
//     //                 <br />
//     //                 <label>
//     //                     Gender:
//     //                     <input
//     //                         type="text"
//     //                         name="gender"
//     //                         value={editedPatient.gender || ''}
//     //                         onChange={handleInputChange}
//     //                     />
//     //                 </label>
//     //                 <br />
//     //                 <label>
//     //                     Age:
//     //                     <input
//     //                         type="number"
//     //                         name="age"
//     //                         value={editedPatient.age || ''}
//     //                         onChange={handleInputChange}
//     //                         pattern="[0-9]*" 
//     //                     />
//     //                 </label>
//     //                 <br />
//     //                 <label>
//     //                     Allergies:
//     //                     <input
//     //                         type="text"
//     //                         name="allergies"
//     //                         value={editedPatient.allergies || ''}
//     //                         onChange={handleInputChange}
//     //                     />
//     //                 </label>
//     //                 <br />
//     //                 <label>
//     //                     PhysicianID:
//     //                     <input
//     //                         type="text"
//     //                         name="physicianID"
//     //                         value={editedPatient.physicianID || ''}
//     //                         onChange={handleInputChange}
//     //                     />
//     //                 </label>
//     //                 <br />
//     //                 <button onClick={handleSubmit}>Save</button>
//     //             </div>
//     //         )}
//     //     </div>
//     );
// };

// export default PatientProfile;
