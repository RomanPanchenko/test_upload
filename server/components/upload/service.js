const fs = require('fs');
const s3 = require('./../../lib/aws/s3');
const testUploadModels = require('./../../models/test_upload');

const getUploadedFilesList = async () => {
};

const uploadFile = async (params = {}) => {
  const { tmpFilePath, originalFilename, contentType } = params;
  try {
    const fileStream = fs.createReadStream(tmpFilePath);
    await s3.putObject({
      path: originalFilename,
      data: fileStream,
      contentType,
    });

    // upsert db record
  } catch (e) {
    // log and throw again
  } finally {
    // delete tmp file
  }
};

module.exports = {
  getUploadedFilesList,
  uploadFile,
};