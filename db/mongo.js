const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://comp413:comp413@comp413-border-detectio.pf1mqdq.mongodb.net/?retryWrites=true&w=majority&appName=comp413-border-detection';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const database = client.db('medical_records');

    // Create Collections with Validation Rules
    await createPhysiciansCollection(database);
    await createPatientsCollection(database);
    await createPatientImagesCollection(database);
    await createImageProcessingCollection(database);

    return database;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function closeConnection() {
  await client.close();
  console.log('Connection closed');
}

async function createPhysiciansCollection(database) {
  const physiciansCollectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['firstName', 'lastName', 'hospitalId'],
        properties: {
          firstName: { bsonType: 'string' },
          lastName: { bsonType: 'string' },
          hospitalId: { bsonType: 'string' }
        }
      }
    }
  };

  await database.createCollection('physicians', physiciansCollectionOptions);
  console.log('Collection "physicians" created successfully with validation rules');
}

async function createPatientsCollection(database) {
  const patientsCollectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['firstName', 'lastName', 'address', 'phoneNumber', 'gender', 'age', 'allergies'],
        properties: {
          firstName: { bsonType: 'string' },
          lastName: { bsonType: 'string' },
          address: { bsonType: 'string' },
          phoneNumber: { bsonType: 'string' },
          gender: { bsonType: 'string' },
          age: { bsonType: 'int' },
          allergies: { bsonType: 'string' }
        }
      }
    }
  };

  await database.createCollection('patients', patientsCollectionOptions);
  console.log('Collection "patients" created successfully with validation rules');
}

async function createPatientImagesCollection(database) {
  const patientImagesCollectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['patientId', 'physicianNotes', 'isPublic'],
        properties: {
          patientId: { bsonType: 'objectId' },
          physicianNotes: { bsonType: 'string' },
          isPublic: { bsonType: 'bool' }
        }
      }
    }
  };

  await database.createCollection('patientImages', patientImagesCollectionOptions);
  console.log('Collection "patientImages" created successfully with validation rules');
}

async function createImageProcessingCollection(database) {
  const imageProcessingCollectionOptions = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['patientImageId', 'image', 'lesionBorder', 'lesionSize', 'lesionType'],
        properties: {
          patientImageId: { bsonType: 'objectId' },
          image: { bsonType: 'string' },
          lesionBorder: { bsonType: 'string' },
          lesionSize: { bsonType: 'string' },
          lesionType: { bsonType: 'string' }
        }
      }
    }
  };

  await database.createCollection('imageProcessing', imageProcessingCollectionOptions);
  console.log('Collection "imageProcessing" created successfully with validation rules');
}

module.exports = { connectToDatabase, closeConnection };