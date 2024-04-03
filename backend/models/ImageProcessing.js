import mongoose from "mongoose";

const imageProcessingSchema = new mongoose.Schema({
  s3image: { type: String, required: true },
  isBenign: { type: Boolean, required: true },
  benignProbability: { type: String, required: true }
});

export const ImageProcessing = mongoose.model('ImageProcessing', imageProcessingSchema);

// module.exports = ImageProcessing;
