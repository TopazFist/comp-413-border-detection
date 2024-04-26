import { useEffect, useState } from "react";
import { api } from "../components/api";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ImageList, ImageListItem, Box } from "@mui/material";
import "./PatientHome.css";

/**
 * Component for patient home page.
 */
const PatientHome = () => {
  // Extract patient ID from route parameters
  const { id } = useParams();
  const [patientImages, setPatientImages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromPhysicianHome = location.pathname.includes("view");

  /**
   * Retrieve patient's images from the server.
   */
  useEffect(() => {
    const fetchPatientImages = async () => {
      try {
        const response = await api.get(`/images/${id}`).catch((error) => {
          // Unauthorized
          if (error.response && error.response.status == 401) {
            window.location.href = "/unauthorized";
          }
        });
        setPatientImages(response.data);
      } catch (error) {
        console.error('Error fetching patient images:', error);
      }
    };

    fetchPatientImages();
  }, [id]);

  /**
   * Handles click event for uploading images for the patient.
   */
  const handleUploadClick = () => {
    navigate(`/patients/${id}/upload`);
  };

  /**
   * Handles checkbox change event to toggle image visibility.
   * 
   * @param {Event} e - The change event object.
   * @param {string} imageId - The ID of the image being toggled.
   */
  const handleCheckboxChange = async (e, imageId) => {
    // Update the privacy status of the selected image
    const updatedImages = patientImages.map((image) => {
      if (image._id === imageId) {
        image.isPublic = e.target.checked;
        api.put(`/images/${imageId}/public`, { isPublic: e.target.checked });
      }
      return image;
    });
    
    // Update state with updated images
    setPatientImages(updatedImages);
  };

  // Render patient's images in a grid
  return (
    <Box sx={{ my: 10, mx: 10 }}>
      <h1 className="text-3xl font-bold mb-6">Patient images: {id} </h1>
      <ImageList cols={3} sx={{ width: 1 }}>
        {fromPhysicianHome && (
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
        )}
        {patientImages.map((patientImage) => (
          <ImageListItem key={patientImage._id} className="image-item">
            <img
              className="image"
              src={"http://localhost:3001/" + patientImage.s3image}
              alt={patientImage.s3image}
            />
            <label className="public-label">
              <input type="checkbox" checked={patientImage.isPublic} onChange={(e) => handleCheckboxChange(e, patientImage._id)} />
              Public
            </label>
            <p className="notes-text">Physician Notes: {patientImage.physicianNotes}</p>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

export default PatientHome;
