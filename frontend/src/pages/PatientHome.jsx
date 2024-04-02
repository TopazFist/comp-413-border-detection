import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientHome = () => {
  const { id } = useParams(); // Extracting physician ID from route parameters
  const [patientImages, setPatientImages] = useState([]);

  useEffect(() => {
    const fetchPatientImages = async () => {
      try {
        const response = await axios.get(`/images/${id}`);
        setPatientImages(response.data);
      } catch (error) {
        console.error('Error fetching patient images:', error);
      }
    };

    fetchPatientImages();
  }, [id]);

  // Handle checkbox modification and physician notes popup

  return (
    <div>
      <h1>Patient Home</h1>
      <div className="grid grid-cols-3 gap-4">
        {patientImages.map(patientImage => (
          <div key={patientImage._id} className="relative">
            <img src={patientImage.s3image} alt={patientImage.imageId} className="w-full h-auto" />
            <label className="absolute bottom-0 right-0">
              Public
              <input type="checkbox" className="ml-1" checked={patientImage.isPublic} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientHome;
