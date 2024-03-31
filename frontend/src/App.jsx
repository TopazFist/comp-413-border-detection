import React from "react";
import {Routes, Route, Navigate} from 'react-router-dom'
import Login from "./pages/Login";
import CreatePatient from "./pages/CreatePatient";
import CreatePhysician from "./pages/CreatePhysician";
import PatientHome from "./pages/PatientHome";
import PhysicianHome from "./pages/PhysicianHome";
import Register from "./pages/Register";
import './styles.css';

const App = () => {
        return(
                <Routes>
                        {/* <Route path='/' element={<Login />} /> */}
                        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login page */}
                        <Route path="/login" element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/registerpatient' element={<CreatePatient />} />
                        <Route path='/registerphysician' element={<CreatePhysician />} />
                        <Route path='/patients/:id' element={<PatientHome />} />
                        <Route path='/physicians/:id' element={<PhysicianHome />} />
                        <Route path='/patients/:id/upload' element={<ImageUpload />} />
                </Routes>
        )
}
// NOTE: last route is just to test if it displays, fix after
export default App