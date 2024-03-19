import express from "express";
const multer = require("multer");
const app = express();

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./image-uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname);
    }
});

const upload = multer({
    storage: storage
});


app.post("/", function(req, res) {
    const uploadFile = upload.single("file");
    uploadFile(req, res, function(err) {
        if (err) {
            console.log("An error occurred when uploading the image");
        } else {
            const file = req.file;
            res.json({
                file: file
            });
        }
    });

    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });
    } else {
        console.log("File received");
        return res.send({
            success: true
        });
    }
});