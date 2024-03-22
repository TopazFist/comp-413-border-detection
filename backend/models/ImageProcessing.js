import mongoose from "mongoose";

const imageProcessingSchema = new mongoose.Schema({
  s3image: { type: String, required: true },
  lesionBorder: { type: String, required: true },
  lesionSize: { type: String, required: true },
  lesionType: { type: String, required: true }
});

export const ImageProcessing = mongoose.model('ImageProcessing', imageProcessingSchema);

// module.exports = ImageProcessing;
