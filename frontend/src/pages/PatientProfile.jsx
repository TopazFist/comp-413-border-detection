import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PatientProfile = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [editedPatient, setEditedPatient] = useState({});

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/patients/${id}`);
                setPatient(response.data);
                setEditedPatient(response.data);
            } catch (error) {
                console.log("Error fetching patient:", error);
                // Handle error
            }
        };

        fetchPatient();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'assignedPhysicianIds') {
            setEditedPatient(prevState => ({
                ...prevState,
                assignedPhysicianIds: value.split(',')
            }));
        } else {
            setEditedPatient(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    
    const handleSubmit = async () => {
        try {
            await axios.patch(`http://localhost:3001/patients/${id}`, editedPatient);
            const response = await axios.get(`http://localhost:3001/patients/${id}`);
            setPatient(response.data);
            alert('Patient information updated successfully!');
        } catch (error) {
            console.error('Error updating patient information:', error);
            alert('Failed to update patient information. Please try again.');
        }
    };
    

    return (
        <div>
            <h1>Edit Profile</h1>
            {editedPatient && (
                <div>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={editedPatient.firstName || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={editedPatient.lastName || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={editedPatient.address || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                    Phone Number:
                        <input
                            type="text"
                            name="phoneNumber"
                            value={editedPatient.phoneNumber || ''}
                            onChange={handleInputChange}
                            pattern="[0-9]*" 
                        />
                    </label>
                    <br />
                    <label>
                        Gender:
                        <input
                            type="text"
                            name="gender"
                            value={editedPatient.gender || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Age:
                        <input
                            type="text"
                            name="age"
                            value={editedPatient.age || ''}
                            onChange={handleInputChange}
                            pattern="[0-9]*" 
                        />
                    </label>
                    <br />
                    <label>
                        Allergies:
                        <input
                            type="text"
                            name="allergies"
                            value={editedPatient.allergies || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        PhysicianID:
                        <input
                            type="text"
                            name="physicianID"
                            value={editedPatient.physicianID || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <button onClick={handleSubmit}>Save</button>
                </div>
            )}
        </div>
    );
};

export default PatientProfile;
