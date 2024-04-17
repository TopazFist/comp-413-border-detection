import { useEffect, useState } from 'react';
import { api } from "../components/api"
import { Link, useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const PhysicianHome = () => {
    const { id } = useParams(); // Extracting physician ID from route parameters
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        api
            .get(`/physicians/${id}`).catch((error) => {
                if (error.response && error.response.status == 401) { // Unauthorized
                  window.location.href = "/unauthorized";
                }
            })
            .then(async (response) => {
                console.log(response);
                // Assuming the physician object has a field named 'patients' containing an array of patient objects
                const physician = response.data;
                const patientIDList = physician.assignedPatientIds || []; // Extracting patient list from physician object
                try {
                    const patientRequests = patientIDList.map(patientID => {
                        return api.get(`/patients/${patientID}`);
                        // replace with what ian and jmak make
                    });
        
                    const patientResponses = await Promise.all(patientRequests);
        
                    const patientList = patientResponses.map(response => response.data);
                    console.log("Patients:", patientList);
                    setPatients(patientList);
                } catch (error) {
                    console.log("Error fetching patients:", error);
                }
            })
            .catch((error) => {
                console.log(error);
                setPatients([{_id: "id", firstName: "first", lastName: "last"}]);
            });
    }, [id]);

    // Function to handle deletion of a patient
    const handleDelete = async (patientId) => {
        try {
            // Remove patient from the physician's assignedPatientIds
            await axios.patch(`http://localhost:3001/physicians/${id}`, {
                assignedPatientIds: patients.filter(patient => patient._id !== patientId).map(patient => patient._id)
            });
    
            // Delete the patient
            await axios.delete(`http://localhost:3001/patients/${patientId}`);
    
            // Update the patient list by removing the deleted patient
            setPatients(prevPatients => prevPatients.filter(patient => patient._id !== patientId));
        } catch (error) {
            console.error('Error deleting patient:', error);
            // Handle deletion error
        }
    };

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="text-3xl my-8 text-center">My Patients</h1>
            <Link to={`/physicians/${id}/patients/create`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Patient
                </button>
            </Link>
            <TableContainer component={Paper} sx={{ width: '100%', maxWidth: 800, marginTop: 4 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>#</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>First Name&nbsp;(g)</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Last Name&nbsp;(g)</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>ID&nbsp;(g)</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Actions</TableCell> {/* New TableCell for actions */}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                className="hover:bg-zinc-200"
                            >
                                <TableCell component="th" scope="row" align="center">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="center">{patient.firstName}</TableCell>
                                <TableCell align="center">{patient.lastName}</TableCell>
                                <TableCell align="center">{patient._id}</TableCell>
                                <TableCell align="center">
                                    <button onClick={() => handleDelete(patient._id)}>Delete</button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PhysicianHome;
