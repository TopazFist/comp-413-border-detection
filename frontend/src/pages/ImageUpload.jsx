import { useState, useRef } from "react";
import { useParams } from 'react-router-dom'
import axios from "axios";
import FormData from "form-data";
import "../styles/imageUpload.css";

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image chosen");
    const inputRef = useRef(null);
    const { id } = useParams();

    const handleButtonClick = () => {
        inputRef.current.click();
    };

    const handleImageSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleImageUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            console.log(file);

            try {
                const response = await axios.post(`http://localhost:3001/upload/${id}`, formData);
                console.log("Upload successful: ", response);

                setFile(null);
                setFileName("No image chosen");
            } catch (error) {
                console.error("Error: ", error);
            }
        } else {
            alert("No file selected!");
        }
    };

    return (
        <section className="drag-area">
            <div>
                <button onClick={handleButtonClick}>Choose Image</button>
                <span>{fileName}</span>
            </div>
            <input ref={inputRef} type="file" hidden onChange={handleImageSelect} />
            <button onClick={handleImageUpload}>Upload Image</button>
        </section>
    );
}

export default ImageUpload;
