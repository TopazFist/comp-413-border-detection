/* PatientHomePhysician.jsx */
import React, { useEffect, useState } from 'react';
import { api } from "../components/api"
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import { SourceImage } from "../components/SourceImage";
import './PatientHome.css';

const ViewPatient = () => {
  const { id } = useParams();
  const [patientImages, setPatientImages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromPhysicianHome = location.pathname.includes("view");

  useEffect(() => {
    const fetchPatientImages = async () => {
      try {
        const response = await api.get(`/images/${id}`);
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
        api.put(`/images/${imageId}/notes`, { physicianNotes: e.target.value });
      }
      return image;
    });
    setPatientImages(updatedImages);
  };

  const getModifiedBorderDetectionPath = (path) => {
    if (!path) return null;
    const pathParts = path.split('/');
    const fileName = pathParts.pop();
    pathParts.push(`_${fileName}`);
    return pathParts.join('/');
  };

  return (
    <Box sx={{ my: 10, mx: 10 }}>
      <h1 className="text-3xl font-bold mb-6">Patient images: {id}</h1>
      <ImageList cols={1} sx={{ width: 1 }}>
        <ImageListItem key="upload" className="upload-item" onClick={handleUploadClick}>
          <div className="upload-icon" style={{alignItems: "center"}}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{alignItems: "center", marginLeft: "auto", marginRight: "auto"}} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9V5a1 1 0 112 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </ImageListItem>
      </ImageList>
      <ImageList cols={2} sx={{ width: 1, marginTop: '1rem' }}>
        {patientImages.map((patientImage) => (
          <React.Fragment key={patientImage._id}>
            <ImageListItem className="image-item">
              <SourceImage patientImage={patientImage} handlePhysicianNotesChange={handlePhysicianNotesChange} />
            </ImageListItem>
            <ImageListItem className="image-item">
              {getModifiedBorderDetectionPath(patientImage.borderDetectionPath) ? (
                <img
                  className="image"
                  src={"http://localhost:3001/" + getModifiedBorderDetectionPath(patientImage.borderDetectionPath)}
                  alt={getModifiedBorderDetectionPath(patientImage.borderDetectionPath)}
                />
              ) : (
                <div className="placeholder-image" style={{ backgroundColor: '#000' }}></div>
              )}
            </ImageListItem>
          </React.Fragment>
        ))}
      </ImageList>
    </Box>
  );
}

export default ViewPatient;