import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import FormData from "form-data";
import "../styles/imageUpload.css";
import { fileApi } from "../components/api"

/**
 * Component that allows users to upload images.
 */
const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image chosen");
    const inputRef = useRef(null);
    const { id } = useParams();

    /**
     * Handles the button click event to trigger the file input.
     */
    const handleButtonClick = () => {
        // Open file selection dialog
        inputRef.current.click();
    };

    /**
     * Handles the selection of an image file.
     * 
     * @param {Object} event - The file selection event.
     */
    const handleImageSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Set the file and its name
            setFile(selectedFile);
            setFileName(selectedFile.name);
            console.log(selectedFile);
        }
    };

    /**
     * Handles the image upload process.
     */
    const handleImageUpload = async () => {
        if (file) {
            // Append the selected file to the FormData object
            const formData = new FormData();
            formData.append("file", file);

            try {
                // Send a POST request to upload the file
                const response = await fileApi.post(`/upload/${id}`, formData);
                console.log("Upload successful: ", response);

                // Reset file state and file name after successful upload
                setFile(null);
                setFileName("No image chosen");
            } catch (error) {
                console.error("Error: ", error);
            }
        } else {
            // Alert user if no file is selected
            alert("No file selected!");
        }
    };

    // Render the image upload section with buttons and file input
    return (
        <section className="drag-area">
            <div>
                <button onClick={handleButtonClick}>Choose Image</button>
                <span>{fileName}</span>
            </div>
            <input ref={inputRef} type="file" hidden onChange={handleImageSelect} />
            <button onClick={handleImageUpload}>Upload Image</button>
            <p><Link to={`/physicians/patients/${id}`}>Go Back</Link></p>
        </section>
    );
}

export default ImageUpload;
