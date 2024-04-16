import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from "../components/api"

const PhysicianProfile = () => {
    const { id } = useParams();
    const [physician, setPhysician] = useState(null);
    const [editedPhysician, setEditedPhysician] = useState({}); // Initialize as an empty object

    useEffect(() => {
        const fetchPhysician = async () => {
            try {
                const response = await api.get(`/physicians/${id}`);
                setPhysician(response.data);
                setEditedPhysician(response.data);
            } catch (error) {
                console.log("Error fetching physician:", error);
                // Handle error
            }
        };

        fetchPhysician();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'assignedPatientIds') {
            // Handle assignedPatientIds separately to prevent unintended modifications
            setEditedPhysician(prevState => ({
                ...prevState,
                assignedPatientIds: value.split(',') // Assuming assignedPatientIds is a comma-separated list
            }));
        } else {
            // Update other fields as usual
            setEditedPhysician(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    
    const handleSubmit = async () => {
        try {
            await api.patch(`/physicians/${id}`, editedPhysician);
            // Fetch the updated physician information after successful update
            const response = await api.get(`/physicians/${id}`);
            setPhysician(response.data); // Update the physician state with the updated information
            alert('Physician information updated successfully!');
        } catch (error) {
            console.error('Error updating physician information:', error);
            alert('Failed to update physician information. Please try again.');
        }
    };
    

    return (
        <div>
            <h1>Edit Profile</h1>
            {editedPhysician && (
                <div>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={editedPhysician.firstName || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={editedPhysician.lastName || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Hospital ID:
                        <input
                            type="text"
                            name="hospitalId"
                            value={editedPhysician.hospitalId || ''}
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

export default PhysicianProfile;
