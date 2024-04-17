import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import FormData from "form-data";
import "../styles/imageUpload.css";
import { fileApi } from "../components/api"

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
            console.log(selectedFile);
        }
    };

    const handleImageUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            console.log(formData.get("file"));

            try {
                const response = await fileApi.post(`/upload/${id}`, formData);
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
            <p><Link to={`/patients/${id}/view`}>Go Back</Link></p>
        </section>
    );
}

export default ImageUpload;
