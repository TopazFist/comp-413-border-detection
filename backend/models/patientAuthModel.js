import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // Import bcrypt library

const { Schema } = mongoose;

const patientAuthSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

// Hashing the password before saving
patientAuthSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to validate password
// patientAuthSchema.methods.isValidPassword = async function(password) {
//   try {
//     console.log(password, this.password)
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     throw new Error(error);
//   }
// };
patientAuthSchema.methods.isValidPassword = async function(password) {
  try {
    console.log('Stored hashed password:', this.password);
    const isValid = await bcrypt.compare(password, this.password);
    console.log('Generated hashed password:', await bcrypt.hash(password, 10));
    return isValid;
  } catch (error) {
    throw new Error(error);
  }
};

export const PatientAuth = mongoose.model('PatientAuth', patientAuthSchema);