// Model that provides functionalities related to image processing data management.

import mongoose from "mongoose";

// Define the schema for image processing data
const imageProcessingSchema = new mongoose.Schema({
  // Path to the image in the S3 bucket
  s3image: { type: String, required: true },
  // Indicates whether the lesion is benign
  isBenign: { type: Boolean, required: true },
  // Probability of the lesion being benign
  benignProbability: { type: String, required: true }
});

// Create and export the model based on the defined schema
export const ImageProcessing = mongoose.model('ImageProcessing', imageProcessingSchema);
