import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CreatePatientFromPhysican = () => {
    const { id: personalPhysicianID } = useParams(); // Extracting physician ID from route parameters

    const [newPatient, setNewPatient] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        gender: '',
        age: '',
        allergies: '',
        physicianID: personalPhysicianID // Assigning the extracted physician ID
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Include physician ID in the request body
            const response = await axios.post('http://localhost:3001/patients', {
                ...newPatient,
                physicianID: personalPhysicianID
            });
            const createdPatient = response.data;
    
            // Fetch current physician's data
            const physicianResponse = await axios.get(`http://localhost:3001/physicians/${personalPhysicianID}`);
            const physician = physicianResponse.data;
    
            // Update assignedPatientIds for the physician
            const updatedAssignedPatientIds = [...physician.assignedPatientIds, createdPatient._id];
            await axios.patch(`http://localhost:3001/physicians/${personalPhysicianID}`, {
                assignedPatientIds: updatedAssignedPatientIds
            });
    
            console.log('New patient created:', createdPatient);
            window.location.href = `/physicians/${personalPhysicianID}`;
    
            // Reset form fields or provide feedback to the user
        } catch (error) {
            console.error('Error creating new patient:', error);
            // Handle errors
        }
    };
    
    return (
        <div>
            <h1>Create New Patient</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstName"
                        value={newPatient.firstName}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Last Name:
                    <input
                        type="text"
                        name="lastName"
                        value={newPatient.lastName}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={newPatient.address}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Phone Number:
                    <input
                        type="text"
                        name="phoneNumber"
                        value={newPatient.phoneNumber}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Gender:
                    <input
                        type="text"
                        name="gender"
                        value={newPatient.gender}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Age:
                    <input
                        type="number"
                        name="age"
                        value={newPatient.age}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Allergies:
                    <input
                        type="text"
                        name="allergies"
                        value={newPatient.allergies}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                {/* Add more fields as needed */}
                <button type="submit">Create Patient</button>
            </form>
        </div>
    );
};

export default CreatePatientFromPhysican;
