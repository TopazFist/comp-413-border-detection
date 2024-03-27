import axios from "axios";
const express = require('express');
const router = express.Router();
const PatientImage = require('../models/PatientImage');
// const ImageProcessing = require('../models/ImageProcessing');
const FormData = require("form-data");

const client = axios.create({
    // Maybe we can set a baseURL?
    baseURL: process.env.SERVER_URL
})

export default {
    async uploadImage(method, resource, image, data) {
        const formData = new FormData();
        formData.append("file", image);
        if (data) {
            formData.append("default", data);
        }

        return client({
            method,
            url: resource,
            data: formData,
        }).then(req => {
            return req.data;
        }).catch(err => {
            console.error("An error occurred when uploading the image:", err);
            throw err;
        })
    }
}

module.exports = router;
