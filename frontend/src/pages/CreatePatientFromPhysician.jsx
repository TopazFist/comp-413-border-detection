import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CreatePatientFromPhysician = () => {
    const { id: physicianID } = useParams(); // Extracting physician ID from route parameters

    const [newPatient, setNewPatient] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        gender: '',
        age: '',
        allergies: '',
        physicianID: physicianID // Assigning the extracted physician ID
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
            // Create the new patient
            const response = await axios.post('http://localhost:3001/patients', newPatient);
            const createdPatient = response.data;
    
            // Update the physician's assignedPatientIds to include the newly created patient
            await axios.patch(`http://localhost:3001/physicians/${physicianID}`, {
                $push: { assignedPatientIds: createdPatient._id } // Push the _id of the newly created patient
            });
    
            console.log('New patient created:', createdPatient);
            window.location.href = `/physicians/${physicianID}`;
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

export default CreatePatientFromPhysician;
