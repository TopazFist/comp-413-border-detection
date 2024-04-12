import { useEffect, useState } from 'react';
import axios from 'axios';
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
        axios
            .get(`http://localhost:3001/physicians/${id}`)
            .then(async (response) => {
                console.log(response);
                // Assuming the physician object has a field named 'patients' containing an array of patient objects
                const physician = response.data;
                const patientIDList = physician.assignedPatientIds || []; // Extracting patient list from physician object
                try {
                        const patientRequests = patientIDList.map(patientID => {
                            return axios.get(`http://localhost:3001/patients/${patientID}`);
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
            });
    }, [id]);

    return (
        <Box sx={{p:4}}>
            <Box>
                <h1 className="text-3xl my-8">My Patients</h1>
                <Link to={`/physicians/${id}/patients/create`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add Patient
                    </button>
                </Link>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="right">First Name&nbsp;(g)</TableCell>
                        <TableCell align="right">Last Name&nbsp;(g)</TableCell>
                        <TableCell align="right">ID&nbsp;(g)</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {patients.map((patient, index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        component="a"
                        href={`/patients/${patient._id}`}
                        >
                        <TableCell component="th" scope="row">
                            {index + 1}
                        </TableCell>
                        <TableCell align="right">{patient.firstName}</TableCell>
                        <TableCell align="right">{patient.lastName}</TableCell>
                        <TableCell align="right">{patient._id}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PhysicianHome;