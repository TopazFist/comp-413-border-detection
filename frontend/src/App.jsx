// import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom'
import WelcomePage from './pages/Welcome';
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePhysician from "./pages/CreatePhysician";
import CreatePatientFromPhysician from "./pages/CreatePatientFromPhysician";
import PatientHome from "./pages/PatientHome";
import PatientProfile from "./pages/PatientProfile";
import PhysicianProfile from "./pages/PhysicianProfile";
import PhysicianHome from "./pages/PhysicianHome";
import ViewPatient from "./pages/ViewPatient";
import ImageUpload from "./pages/ImageUpload";
import Navbar from "./components/navbar";
import Box from "@mui/material/Box";
import NurseRegister from './pages/CreateNurse'; 
import NurseLogin from './pages/loginNurse';
import NurseViewPatient from "./pages/NurseViewPatient";
import Unauthorized from "./pages/Unauthorized";
import Logout from "./pages/Logout";

// import PhysicianLogin from "./pages/newLoginPhysician";
import NurseHome from "./pages/NurseHome";

import './styles/styles.css';
import PhysicianLogin from "./pages/loginPhysician";

const App = () => {
        return (
                <Box >
                        <Navbar />
                        <Routes>
                                {/* <Route path='/' element={<Login />} /> */}
                                <Route path="/" element={<Navigate to="/welcome" />} /> {/* Redirect to welcome page */}

                                <Route path="/welcome" element={<WelcomePage />} />
                                <Route path="/patients/login" element={<Login />} />
                                <Route path='/patients/register' element={<Register />} />
                                <Route path='/physicians/login' element={<PhysicianLogin />} />
                                <Route path='/physicians/register' element={<CreatePhysician />} />
                                <Route path='/physicians/:id/patients/create' element={<CreatePatientFromPhysician />} />
                                <Route path='/nurses/register' element={<NurseRegister />} />
                                <Route path='/nurses/login' element={<NurseLogin />} />
                                <Route path='/physicians/:id/profile' element={<PhysicianProfile />} />
                                <Route path='/patients/:id' element={<PatientHome />} />
                                <Route path='/patients/:id/upload' element={<ImageUpload />} />
                                <Route path='/patients/:id/profile' element={<PatientProfile />} />
                                <Route path='/physicians/:id' element={<PhysicianHome />} />
                                <Route path='/physicians/patients/:id' element={<ViewPatient />} />
                                <Route path='/nurses/:id' element={<NurseHome />} />
                                <Route path="/nurses/patients/:id/view" element={<NurseViewPatient />} />
                                <Route path='/unauthorized' element={<Unauthorized />} />
                                <Route path="/logout" element={<Logout />} />
                        </Routes>
                </Box>
        )
}
// NOTE: last route is just to test if it displays, fix after
export default App