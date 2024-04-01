import React, { useState, useRef } from "react";
// import axios from "axios";
import "../styles/imageUpload.css";

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const inputRef = useRef(null);

    const handleButtonClick = () => {
        inputRef.current.click();
    };

    const handleChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setIsActive(true);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsActive(true);
    };

    const handleDragLeave = () => {
        setIsActive(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const uploadedFile = event.dataTransfer.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setIsActive(true);
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
            setIsActive(false);
            return null;
        }
    };

    return (
        <section className={`drag-area ${isActive ? "active" : ""}`}
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 onDrop={handleDrop}>
            <section className="icon">
                {/* <i className="cloud-upload"></i> */}
            </section>
            <header>
                {isActive ? "Release to Upload Image" : "Drag & Drop Image"}
            </header>
            <span>or</span>
            <button onClick={handleButtonClick}>Browse Image</button>
            <input ref={inputRef} type="file" hidden onChange={handleChange}></input>
            {file && showFile()}
        </section>
    );
}

export default ImageUpload;
