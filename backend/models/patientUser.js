import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const patientUser = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  patientIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient' // Assuming you have a 'Patient' model
  }]
}, {
  timestamps: true
});

const User = mongoose.model('patientUser', patientUser);

export default User;