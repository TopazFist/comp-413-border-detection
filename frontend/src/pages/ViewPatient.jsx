/* PatientHomePhysician.jsx */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import './PatientHome.css'; // Import CSS file for styling

const ViewPatient = () => {
  const { id } = useParams(); // Extracting patient ID from route parameters
  const [patientImages, setPatientImages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromPhysicianHome = location.pathname.includes("view");

  useEffect(() => {
    const fetchPatientImages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/images/${id}`);
        setPatientImages(response.data);
      } catch (error) {
        console.error('Error fetching patient images:', error);
      }
    };

    fetchPatientImages();
  }, [id]);

  const handleUploadClick = () => {
    navigate(`/patients/${id}/upload`);
  };

  const handlePhysicianNotesChange = async (e, imageId) => {
    const updatedImages = patientImages.map((image) => {
      if (image._id === imageId) {
        image.physicianNotes = e.target.value;
        axios.put(`http://localhost:3001/images/${imageId}/notes`, { physicianNotes: e.target.value });
      }
      return image;
    });
    setPatientImages(updatedImages);
  };

  return (
    <Box sx={{ my: 10, mx: 10 }}>
      <h1 className="text-3xl font-bold mb-6">Patient images: {id}</h1>
      <ImageList cols={3} sx={{ width: 1 }}>
        <ImageListItem key="upload" className="upload-item" onClick={handleUploadClick}>
          <div className="upload-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9V5a1 1 0 112 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </ImageListItem>
        {patientImages.map((patientImage) => (
          <ImageListItem key={patientImage._id} className="image-item">
            <img
              className="image"
              src={"http://localhost:3001/" + patientImage.s3image}
              alt={patientImage.s3image}
            />
            <div className="benign-status">
              <p className={`benign-text ${patientImage.isBenign ? 'benign-true' : 'benign-false'}`}>
                Benign: {patientImage.isBenign ? 'True' : 'False'}
              </p>
              <p className="probability-text">
                Probability: {Math.round(patientImage.benignProbability * 100)}%
              </p>
            </div>
            <label className="notes-label">
              <input 
                type="text" 
                value={patientImage.physicianNotes} 
                onChange={(e) => handlePhysicianNotesChange(e, patientImage._id)} 
              />
            </label>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

export default ViewPatient;
