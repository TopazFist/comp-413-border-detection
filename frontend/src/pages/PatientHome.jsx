import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import ImageListItemBar from '@mui/material/ImageListItemBar';

const PatientHome = () => {
  const { id } = useParams(); // Extracting physician ID from route parameters
  const [patientImages, setPatientImages] = useState([]);

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

  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate(`/patients/${id}/upload`);
  };

  return (
    <Box sx={{my: 10}}>
      <h1 className="text-3xl font-bold mb-6">Patient images: {id}</h1>
      <ImageList cols={3}>
        <ImageListItem key="upload">
          <div className="relative flex justify-center items-center">
            <div style={{width: 300}}onClick={handleUploadClick}>
              <svg style={{ maxHeight: '200px' }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full mx-auto text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9V5a1 1 0 112 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </ImageListItem>
        {patientImages.map((patientImage) => (
          <ImageListItem key={patientImage._id} className="border border-gray-300 rounded-lg p-4 cursor-pointer">
            {/* <label className="absolute top-0 left-0 mt-2 ml-2 bg-white p-2 rounded-lg">
              <input type="checkbox" className="mr-1" checked={patientImage.isPublic} />
              Public
            </label> */}
            <img
              src={"http://localhost:3001/" + patientImage.s3image} 
              alt={patientImage.s3image} 
              className="w-full h-full object-cover" 
              style={{ maxHeight: '200px' }} 
            />
            <ImageListItemBar
              title={patientImage.s3image}
              subtitle={patientImage._id}
              position="below"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

export default PatientHome;
