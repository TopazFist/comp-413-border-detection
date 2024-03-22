// aws.js
const AWS = require('aws-sdk');

// REPLACE THIS DEPENDING ON AWS EDUCATE APPLICATION
AWS.config.update({
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
  region: 'your-region',
});

const s3 = new AWS.S3();

module.exports = s3;
