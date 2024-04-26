import request from 'supertest'; // To simulate HTTP requests
import { expect } from 'chai';  // To perform assertions
import sinon from 'sinon';      // To mock/stub functions
import { app } from '../index.js';   // Your Express app
import { Nurse } from '../models/nurseModel.js'; // Ensure the correct path for the Nurse model

describe('Nurse Controller Tests', () => {
  let sandbox;

  // Create a sandbox before each test
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  // Restore the sandbox after each test
  afterEach(() => {
    sandbox.restore();
  });

  it('should get all nurses', async () => {
    const mockNurses = [
      { _id: '1', firstName: 'Alice', createdAt: '2023-01-01' },
      { _id: '2', firstName: 'Bob', createdAt: '2023-02-01' },
    ];

    // Stub `Nurse.find` to return mock data
    sandbox.stub(Nurse, 'find').returns({
      sort: sinon.stub().returns(mockNurses),
    });

    const response = await request(app).get('/nurses');
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockNurses);
  });


  it('should create a new nurse', async () => {
    const newNurse = {
      firstName: 'Charlie',
      lastName: 'Smith',
      hospitalId: '12345',
    };

    // Stub `Nurse.create` to return the new nurse
    sandbox.stub(Nurse, 'create').returns(Promise.resolve(newNurse));

    const response = await request(app)
      .post('/nurses')
      .send(newNurse);

    expect(response.status).to.equal(200);
    expect(response.body.firstName).to.equal('Charlie');
  });


});
