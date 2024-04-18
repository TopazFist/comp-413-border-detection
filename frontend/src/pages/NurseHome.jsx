import { useEffect, useState } from "react";
import { api } from "../components/api"
import { Link, useParams } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const NurseHome = () => {
    // Extract nurse ID from route parameters
    const { id } = useParams();
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        api
            .get(`/nurses/${id}`).catch((error) => {
                if (error.response && error.response.status == 401) { // Unauthorized
                  window.location.href = "/unauthorized";
                }
            })
            .then(async (response) => {
                // Assumes the nurse object has a field called "patients" that contains an array of patient objects
                const nurse = response.data;

                // Extract patient list from nurse object
                const patientIDList = nurse.assignedPatientIds || [];
                try {
                    const patientRequests = patientIDList.map(patientID => {
                        return api.get(`/patients/${patientID}`);
                    });
        
                    const patientResponses = await Promise.all(patientRequests);
        
                    const patientList = patientResponses.map(response => response.data);
                    setPatients(patientList);
                } catch (error) {
                    console.log("Error fetching patients:", error);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="text-3xl my-8 text-center">My Patients</h1>
            <Link to={`/nurses/${id}/patients/add`}>
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
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onClick={() => (window.location.href = `/nurses/patients/${patient._id}`)}
                                className="cursor-pointer hover:bg-zinc-200"
                            >
                                <TableCell component="th" scope="row" align="center">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="center">{patient.firstName}</TableCell>
                                <TableCell align="center">{patient.lastName}</TableCell>
                                <TableCell align="center">{patient._id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default NurseHome;
