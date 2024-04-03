import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Patient Home</h1>
      <div className="grid grid-cols-3 gap-8">
        {patientImages.map(patientImage => (
          <div key={patientImage._id} className="relative">
            <label className="absolute top-0 left-0 mt-2 ml-2 bg-white p-2 rounded-lg">
              <input type="checkbox" className="mr-1" checked={patientImage.isPublic} />
              Public
            </label>
            <img src={"http://localhost:3001/" + patientImage.s3image} alt={patientImage.s3image} className="w-full h-full object-cover" style={{ maxHeight: '200px' }} />
          </div>
        ))}
        <div className="relative flex justify-center items-center">
          <div className="w-full h-full max-w-xs max-h-xs border border-gray-300 rounded-lg p-4 cursor-pointer" onClick={handleUploadClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9V5a1 1 0 112 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHome;
