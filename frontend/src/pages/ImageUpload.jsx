import React, { useState, useRef } from "react";
import axios from "axios";
import FormData from "form-data";
import { PORT } from "/Users/amyzuo/Downloads/comp-413-border-detection/backend/config.js";
import "../styles/imageUpload.css";

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const inputRef = useRef(null);

    const handleButtonClick = () => {
        console.log("Button is clicked!");
        inputRef.current.click();
    };

    const handleImageUpload = (event) => {
        const image = event.target.files[0];
        if (image) {
            setFile(image);
        }
        
        const formData = new FormData();
        formData.append("file", image);

        axios.post(`http://localhost:${PORT}/upload`, formData)
        .then(response => console.log(response))
        .catch(error => console.log(error));
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const uploadedFile = event.dataTransfer.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    const showFile = () => {
        if (!file) {
            return null;
        }

        const fileType = file.type;
        const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
        if (validExtensions.includes(fileType)) {
            const fileURL = URL.createObjectURL(file);
            return <img src={fileURL} alt="Uploaded" />;
        } else {
            alert("This is not a valid image!");
            return null;
        }
    };

    return (
        <section className="drag-area"
                 onDrop={handleDrop}>
            <section className="icon">
                {/* <i className="cloud-upload"></i> */}
            </section>
            <header>
                {"Drag & Drop Image"}
            </header>
            <span>or</span>
            <button onClick={handleButtonClick}>Browse Image</button>
            <input ref={inputRef} type="file" hidden onChange={handleImageUpload}></input>
            {file && showFile()}
        </section>
    );
}

export default ImageUpload;
