import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const nurseAuthSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  nurseId: { type: String, required: true }
});

// Hashing the password before saving
nurseAuthSchema.pre('save', async function(next) {
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
nurseAuthSchema.methods.isValidPassword = async function(password) {
  try {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  } catch (error) {
    throw new Error(error);
  }
};

export const NurseAuth = mongoose.model('NurseAuth', nurseAuthSchema);