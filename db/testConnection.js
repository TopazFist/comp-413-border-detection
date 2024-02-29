const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://comp413:comp413@comp413-border-detectio.pf1mqdq.mongodb.net/?retryWrites=true&w=majority&appName=comp413-border-detection';

async function testConnection() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connection to MongoDB successful');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}

testConnection();
