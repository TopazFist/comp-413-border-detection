const { mongoose } = require('mongoose'); // Adjust the path based on your project structure

const uri = 'mongodb+srv://comp413:comp413@comp413-border-detectio.pf1mqdq.mongodb.net/medical_records?retryWrites=true&w=majority&appName=comp413-border-detection';


async function testMongooseConnection() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB Atlas using Mongoose');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

testMongooseConnection();
