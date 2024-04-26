import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/Welcome";
import Unauthorized from "./pages/Unauthorized";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import PhysicianLogin from "./pages/loginPhysician";
import NurseLogin from "./pages/loginNurse";
import Register from "./pages/Register";
import CreatePhysician from "./pages/CreatePhysician";
import NurseRegister from "./pages/CreateNurse";
import PatientHome from "./pages/PatientHome";
import PhysicianHome from "./pages/PhysicianHome";
import NurseHome from "./pages/NurseHome";
import PatientProfile from "./pages/PatientProfile";
import PhysicianProfile from "./pages/PhysicianProfile";
import ViewPatient from "./pages/ViewPatient";
import NurseViewPatient from "./pages/NurseViewPatient";
import CreatePatientFromPhysician from "./pages/CreatePatientFromPhysician";
import AddPatientFromNurse from "./pages/AddPatientFromNurse";
import ImageUpload from "./pages/ImageUpload";
import Navbar from "./components/navbar";
import Box from "@mui/material/Box";
import "./styles/styles.css";

/**
 * Main component of the application responsible for routing and rendering different pages.
 */
const App = () => {
        return (
                <Box >
                        <Navbar />
                        {/* Routing setup */}
                        <Routes>
                                {/* <Route path='/' element={<Login />} /> */}

                                {/* Redirect to welcome page */}
                                <Route path="/" element={<Navigate to="/welcome" />} />

                                <Route path="/welcome" element={<WelcomePage />} />
                                <Route path='/unauthorized' element={<Unauthorized />} />
                                <Route path="/logout" element={<Logout />} />

                                {/* Login routes */}
                                <Route path="/patients/login" element={<Login />} />
                                <Route path='/physicians/login' element={<PhysicianLogin />} />
                                <Route path='/nurses/login' element={<NurseLogin />} />

                                {/* Registration routes */}
                                <Route path='/patients/register' element={<Register />} />
                                <Route path='/physicians/register' element={<CreatePhysician />} />
                                <Route path='/nurses/register' element={<NurseRegister />} />

                                {/* Home routes */}
                                <Route path='/patients/:id' element={<PatientHome />} />
                                <Route path='/physicians/:id' element={<PhysicianHome />} />
                                <Route path='/nurses/:id' element={<NurseHome />} />

                                {/* Profile routes */}
                                <Route path='/patients/:id/profile' element={<PatientProfile />} />
                                <Route path='/physicians/:id/profile' element={<PhysicianProfile />} />

                                {/* View patient routes */}
                                <Route path='/physicians/patients/:id' element={<ViewPatient />} />
                                <Route path="/nurses/patients/:id" element={<NurseViewPatient />} />

                                {/* Add patient routes */}
                                <Route path='/physicians/:id/patients/create' element={<CreatePatientFromPhysician />} />
                                <Route path="/nurses/:id/patients/add" element={<AddPatientFromNurse />} />

                                {/* Image upload route */}
                                <Route path='/patients/:id/upload' element={<ImageUpload />} />
                        </Routes>
                </Box>
        )
}

export default App;
