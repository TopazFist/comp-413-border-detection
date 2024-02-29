const mongoose = require('mongoose');

const uri = 'mongodb+srv://comp413:comp413@comp413-border-detectio.pf1mqdq.mongodb.net/medical_records?retryWrites=true&w=majority&appName=comp413-border-detection';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB Atlas'));

module.exports = { mongoose };
