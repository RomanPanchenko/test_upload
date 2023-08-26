const fs = require('fs');
const s3 = require('./../../lib/aws/s3');
const testUploadModels = require('./../../models/test_upload');
const config = require("config");
const di = require('./../../di').container;

const DEFAULT_BUCKET_NAME = config.get('aws.s3.file_upload.bucket_name');

const unlink = (fileName) => new Promise((resolve, reject) => {
  fs.unlink(fileName, (error) => {
    if (error) return reject(error)
    resolve()
  })
})

const getUploadedFileById = async (fileId) => {
  const uploadedFile = await testUploadModels.file.findOne({ where: { id: fileId } });

  const fileContent = await s3.getObject({
    path: uploadedFile.name,
  });

  return { fileContent, fileName: uploadedFile.name };
};

const getUploadedFilesList = async () => {
  const bucket = await testUploadModels.bucket.findOne({ where: { name: DEFAULT_BUCKET_NAME } });
  const uploadedFiles = await testUploadModels.file.findAll();

  const result = [];

  uploadedFiles.forEach(f => {
    result.push({
      id: f.id,
      name: f.name,
      size: f.size,
      url: bucket.url + f.url,
      createdAt: f.created_at,
      updatedAt: f.updated_at,
    });
  });

  return result;
};

const uploadFile = async (params = {}) => {
  const { tmpFilePath, originalFilename, contentType, size } = params;
  try {
    const fileStream = fs.createReadStream(tmpFilePath);
    const s3Response = await s3.putObject({
      path: originalFilename,
      data: fileStream,
      contentType,
    });

    const bucket = await testUploadModels.bucket.findOne({ where: { name: DEFAULT_BUCKET_NAME } });
    let uploadedFile = await testUploadModels.file.findOne({ where: { name: originalFilename } });
    const NOW = +new Date();
    if (uploadedFile) {
      uploadedFile.size = size;
      await testUploadModels.file.update({ size }, { where: { id: uploadedFile.id, updated_at: NOW } });
    } else {
      await testUploadModels.file.create({
        name: originalFilename,
        size,
        url: originalFilename,
        bucket_id: bucket.id,
        created_at: NOW,
        updated_at: NOW,
      });
    }

    uploadedFile = await testUploadModels.file.findOne({ where: { name: originalFilename } });
    await testUploadModels.version.create({
      file_id: uploadedFile.id,
      version: s3Response.VersionId,
    });
  } catch (e) {
    di.Logger.error(e);
  }

  try {
    await unlink(tmpFilePath);
  } catch (e) {
    di.Logger.error(e);
  }
};

module.exports = {
  getUploadedFilesList,
  getUploadedFileById,
  uploadFile,
};