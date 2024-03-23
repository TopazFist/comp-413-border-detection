import React from "react";
import {Routes, Route} from 'react-router-dom'
import Login from "./pages/Login";
import CreatePatient from "./pages/CreatePatient";
import CreatePhysician from "./pages/CreatePhysician";
import PatientHome from "./pages/PatientHome";
import PhysicianHome from "./pages/PhysicianHome";
import PatientList from "./pages/PatientList";

const App = () => {
        return(
                <Routes>
                        <Route path='/' element={<Login />} />
                        <Route path='/registerpatient' element={<CreatePatient />} />
                        <Route path='/registerphysician' element={<CreatePhysician />} />
                        <Route path='/patients/home/:id' element={<PatientHome />} />
                        <Route path='/physicians/home/:id' element={<PhysicianHome />} />
                        <Route path='/physicians/patientlist' element={<PatientList />} />
                </Routes>
        )
}
// NOTE: last route is just to test if it displays, fix after
export default App