import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';

const PhysicianHome = () => {
    const { id } = useParams(); // Extracting physician ID from route parameters
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
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
                        setLoading(false);
                    } catch (error) {
                        console.log("Error fetching patients:", error);
                        setLoading(false);
                    }
                })
        .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl my-8">My Patients</h1>
                <Link to={`/physicians/${id}/patients/create`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add Patient
                    </button>
                </Link>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <table className="w-full border-separate border-spacing-2">
                    <thead>
                        <tr>
                            <th className="border border-gray-600 rounded-md">Number</th>
                            <th className="border border-gray-600 rounded-md">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient, index) => (
                            <tr key={index} className="h-8">
                                <td className="border border-gray-700 rounded-md text-center">{index + 1}</td>
                                <td className="border border-gray-700 rounded-md text-center">
                                    <Link to={`/patients/${patient._id}`}>{patient.firstName} {patient.lastName}</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PhysicianHome;
