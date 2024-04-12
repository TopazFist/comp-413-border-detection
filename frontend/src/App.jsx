// import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom'
import WelcomePage from './pages/Welcome';
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePatient from "./pages/CreatePatient";
import CreatePhysician from "./pages/CreatePhysician";
import PatientHome from "./pages/PatientHome";
import PhysicianHome from "./pages/PhysicianHome";
import ImageUpload from "./pages/ImageUpload";
import NurseHome from "./pages/NurseHome";

import './styles/styles.css';
import PhysicianLogin from "./pages/loginPhysician";

const App = () => {
        return(
                <Routes>
                        {/* <Route path='/' element={<Login />} /> */}
                        <Route path="/" element={<Navigate to="/welcome" />} /> {/* Redirect to welcome page */}

                        <Route path="/welcome" element={<WelcomePage />} />
                        <Route path="/patients/login" element={<Login />} />
                        <Route path='/patients/register' element={<Register />} />
                        <Route path='/registerpatient' element={<CreatePatient />} />
                        <Route path='/physicians/login' element={<PhysicianLogin />} />
                        <Route path='/physicians/register' element={<CreatePhysician />} />
                        <Route path='/patients/:id' element={<PatientHome />} />
                        <Route path='/patients/:id/upload' element={<ImageUpload />} />
                        <Route path='/physicians/:id' element={<PhysicianHome />} />
                        <Route path='/nurses/:id' element={<NurseHome />} />
                </Routes>
        )
}
// NOTE: last route is just to test if it displays, fix after
export default App