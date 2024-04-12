import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';

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
    <Box sx={{my: 10, mx: 10}}>
      <h1 className="text-3xl font-bold mb-6">Patient images: {id}</h1>
      <ImageList cols={3} sx={{width: 1}}>
        <ImageListItem key="upload" sx={{m: 1}}>
          <div className="border border-gray-300 rounded-lg cursor-pointer">
            <div onClick={handleUploadClick}>
              <svg style={{ maxHeight: '200px' }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full mx-auto text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9V5a1 1 0 112 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </ImageListItem>
        {patientImages.map((patientImage) => (
          <ImageListItem key={patientImage._id}  sx={{m: 1, p: 1}} className="border border-gray-300 rounded-lg cursor-pointer">
            <label className="absolute border border-gray-300 top-0 left-0 mt-2 ml-2 bg-white p-2 rounded-lg">
              <input type="checkbox" className="mr-1" checked={patientImage.isPublic} />
              Public
            </label>
            <label style={{width: "40%"}}className="absolute border border-gray-300 top-0 right-0 mt-2 ml-2 bg-white p-2 rounded-lg">
              Test annotation: {patientImage.s3image}
            </label>
            <img className="rounded-lg"
              src={"http://localhost:3001/" + patientImage.s3image} 
              alt={patientImage.s3image} 
              style={{ maxHeight: '400px', minHeight: '100px'}} 
            />
            <label className="absolute border border-gray-300 bottom-0 left-0 mt-2 ml-2 bg-white p-2 rounded-lg">
              <DeleteIcon color="error" className="cursor-pointer"/>
            </label>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

export default PatientHome;
