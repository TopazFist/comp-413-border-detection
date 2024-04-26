import request from 'supertest'; // To simulate HTTP requests
import { expect } from 'chai';  // To perform assertions
import sinon from 'sinon';      // To mock/stub functions
import { app } from '../index.js';   // Your Express app
import { Patient } from '../models/patientModel.js'; // The model to be mocked

describe('Patient Controller Tests', () => {
  let sandbox;

  // Setup and teardown
  beforeEach(() => {
    sandbox = sinon.createSandbox(); // Create a new sandbox for each test
  });

  afterEach(() => {
    sandbox.restore(); // Restore the sandbox after each test
  });

  // Test for fetching all patients
  it('should fetch all patients and return them in descending order of creation', async () => {
    const mockPatients = [
      { _id: '1', firstName: 'John', createdAt: '2024-04-26T20:02:11.947Z' },
      { _id: '2', firstName: 'Jane', createdAt:'2024-04-26T20:02:11.947Z'  },
    ];

    // Mock the Patient.find method to return the mock data
    sandbox.stub(Patient, 'find').returns({
      sort: sinon.stub().returns(mockPatients),
    });

    const response = await request(app).get('/patients');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockPatients);
  });

  // Test for fetching a single patient
  it('should fetch a patient by ID', async () => {
    const mockPatient = { _id: '65e39a017dc8fe6c759ce848', firstName: 'Jonathan' };

    // Mock the Patient.findById method
    sandbox.stub(Patient, 'findById').returns(Promise.resolve(mockPatient));

    const response = await request(app).get('/patients/65e39a017dc8fe6c759ce848');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockPatient);
  });

  // Test for creating a new patient
  it('should create a new patient', async () => {
    const newPatient = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      phoneNumber: '123-456-7890',
      gender: 'M',
      age: 30,
      allergies: 'None',
      physicianID: '12345',
    };

    // Mock the Patient.create method to return the new patient
    sandbox.stub(Patient, 'create').returns(Promise.resolve(newPatient));

    const response = await request(app)
      .post('/patients')
      .send(newPatient);

    expect(response.status).to.equal(200);
    expect(response.body.firstName).to.equal('John');
  });

});
