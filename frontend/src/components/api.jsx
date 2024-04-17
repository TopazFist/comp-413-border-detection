import axios from 'axios';

const apiInstance = axios.create({
    baseURL: 'http://localhost:3001', // Backend URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Send cookies with requests
});

const fileApi = axios.create({
    baseURL: 'http://localhost:3001', // Backend URL
    headers: {
        'Content-Type': 'multipart/form-data', // Use multipart/form-data for file uploads
        'Accept': 'application/json',
    },
    withCredentials: true, // Send cookies with requests
});

export { apiInstance as api , fileApi};