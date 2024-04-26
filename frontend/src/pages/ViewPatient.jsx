import React, { useEffect, useState } from "react";
import { api } from "../components/api";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ImageList, ImageListItem, Box } from "@mui/material";
import { SourceImage } from "../components/SourceImage";
import "./PatientHome.css";

/**
 * Component for viewing patient images.
 */
const ViewPatient = () => {
  // Extract patient ID from route parameters
  const { id } = useParams();
  const [patientImages, setPatientImages] = useState([]);

  // Hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();
  const fromPhysicianHome = location.pathname.includes("view");

  /**
   * Retrieve patient images.
   */
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

  /**
   * Handle click event for uploading images.
   */
  const handleUploadClick = () => {
    navigate(`/patients/${id}/upload`);
  };

  /**
   * Handle change event for physician notes associated with an image.
   * 
   * @param {Object} e - The event object.
   * @param {string} imageId - The ID of the image whose physician notes are being updated.
   */
  const handlePhysicianNotesChange = async (e, imageId) => {
    const updatedImages = patientImages.map((image) => {
      if (image._id === imageId) {
        // Update the physician notes for the specified image
        image.physicianNotes = e.target.value;

        // Send a request to update physician notes on the server
        api.put(`/images/${imageId}/notes`, { physicianNotes: e.target.value });
      }
      return image;
    });

    // Update the patient images state with the updated physician notes
    setPatientImages(updatedImages);
  };

  /**
   * Constructs a modified border detection path.
   * 
   * @param {string} path - The original path of the border detection image.
   * 
   * @returns {string|null} - The modified path of the border detection image, or null if no input path is given.
   */
  const getModifiedBorderDetectionPath = (path) => {
    // Check if the path exists.
    if (!path) {
      return null;
    }

    // Remove the filename from the path and append a suffix
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
