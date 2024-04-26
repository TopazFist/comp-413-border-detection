import { useEffect, useState } from "react";
import { api } from "../components/api";
import { Link, useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Component for nurse home page.
 */
const NurseHome = () => {
    // Extract nurse ID from route parameters
    const { id } = useParams();
    const [patients, setPatients] = useState([]);

    /**
     * Retrieve nurse's patients from the server.
     */
    useEffect(() => {
        api
            // Retrieve nurse data including assigned patients
            .get(`/nurses/${id}`).catch((error) => {
                // Unauthorized
                if (error.response && error.response.status == 401) {
                  window.location.href = "/unauthorized";
                }
            })
            .then(async (response) => {
                // Assumes the nurse object has a field called "patients" that contains an array of patient objects
                const nurse = response.data;

                // Extract patient list from nurse object
                const patientIDList = nurse.assignedPatientIds || [];
                try {
                    // Retrieve data of each assigned patient
                    const patientRequests = patientIDList.map(patientID => {
                        return api.get(`/patients/${patientID}`);
                    });
        
                    const patientResponses = await Promise.all(patientRequests);

                    // Extract patient details from the responses
                    const patientList = patientResponses.map(response => response.data);

                    // Set the list of patients in state
                    setPatients(patientList);
                } catch (error) {
                    console.log("Error fetching patients:", error);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]); // Trigger effect when nurse ID changes

    /**
     * Remove a patient from the nurse's assigned patients list.
     * 
     * @param {string} patientId - The ID of the patient to be removed.
     * @param {Object} event - The event object triggered by the delete action.
     */
    const handleDelete = async (patientId, event) => {
        // Prevent event from navigating to patient's home page
        event.stopPropagation();

        try {
            // Remove patient from the nurse's assignedPatientIds
            await api.patch(`/nurses/${id}`, {
                assignedPatientIds: patients.filter(patient => patient._id !== patientId).map(patient => patient._id)
            });

            // Update patient list by removing specified patient
            setPatients(prevPatients => prevPatients.filter(patient => patient._id !== patientId));
        } catch (error) {
            console.error("Error deleting patient:", error);
        }
    };

    // Render nurse's assigned patients in a table
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
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>First Name&nbsp;</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Last Name&nbsp;</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>ID&nbsp;</TableCell>
                        <TableCell align="center" style={{ fontWeight: 'bold' }}>Delete&nbsp;</TableCell>
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
                                <TableCell align="center">
                                    <button onClick={(event) => handleDelete(patient._id, event)}>
                                        <DeleteIcon></DeleteIcon>
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default NurseHome;
