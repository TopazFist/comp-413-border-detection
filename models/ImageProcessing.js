const mongoose = require('mongoose');

const imageProcessingSchema = new mongoose.Schema({
  s3image: { type: String, required: true },
  lesionBorder: { type: String, required: true },
  lesionSize: { type: String, required: true },
  lesionType: { type: String, required: true }
});

const ImageProcessing = mongoose.model('ImageProcessing', imageProcessingSchema);

module.exports = ImageProcessing;
