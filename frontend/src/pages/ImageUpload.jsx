import React from "react";
import axios from "axios";

const ImageUpload = () => {
    
}

const dropArea = document.querySelector(".drag-area");
const dragText = dropArea.querySelector("header");
const button = dropArea.querySelector("button");
const input = dropArea.querySelector("input");
let file;

button.onclick = () => {
  input.click();
}

input.addEventListener("change", function() {
  file = this.files[0];
  dropArea.classList.add("active");
  showFile();
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  file = event.dataTransfer.files[0];
  showFile();
});

function showFile() {
  const fileType = file.type;
  const validExtensions = ["image/jpeg", "image/jpg", "image/png"];

  if (validExtensions.includes(fileType)) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const fileURL = fileReader.result;
      const imgTag = `<img src="${fileURL}" alt="image">`;
      dropArea.innerHTML = imgTag;
    }
    fileReader.readAsDataURL(file);
  } else {
    alert("This is not a valid image file!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}