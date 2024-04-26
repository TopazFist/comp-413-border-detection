// Provides Axios instances for making API requests.

import axios from "axios";

// Axios instance for regular JSON API requests
const apiInstance = axios.create({
    // Backend URL
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // Send cookies with requests
    withCredentials: true,
});

// Axios instance for file uploads using multipart/form-data
const fileApi = axios.create({
    // Backend URL
    baseURL: 'http://localhost:3001',
    headers: {
        // Use multipart/form-data for file uploads
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
    },
    // Send cookies with requests
    withCredentials: true,
});

export { apiInstance as api , fileApi };
