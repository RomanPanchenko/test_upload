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

const getFileFromS3 = async (fileId, versionId) => {
  const uploadedFile = await testUploadModels.file.findOne({ where: { id: fileId } });

  const fileContent = await s3.getObject({
    path: uploadedFile.name,
    ...(versionId) && { versionId },
  });

  return { fileContent, fileName: uploadedFile.name };
};

const getUploadedFilesList = async () => {
  const bucket = await testUploadModels.bucket.findOne({ where: { name: DEFAULT_BUCKET_NAME } });
  const uploadedFiles = await testUploadModels.file.findAll({
    include: [{
      model: testUploadModels.version,
      as: 'versions',
      required: true,
    }],
    order: [
      [{ model: testUploadModels.version, as: 'versions' }, 'file_id', 'asc'],
      [{ model: testUploadModels.version, as: 'versions' }, 'created_at', 'desc'],
    ]
  });

  const result = [];

  uploadedFiles.forEach(f => {
    result.push({
      id: f.id,
      name: f.name,
      versions: f.versions.map(v => ({
        version_id: v.version_id,
        size: v.size,
        url: bucket.url + '/' + f.url + '?versionId=' + v.version_id,
        created_at: v.created_at,
      })),
    });
  });

  return result;
};

const uploadFile = async (params = {}) => {
  const { tmpFilePath, originalFilename, contentType, size } = params;
  const result = { url: '' };
  let s3Response;

  try {
    const fileStream = fs.createReadStream(tmpFilePath);
    s3Response = await s3.putObject({
      path: originalFilename,
      data: fileStream,
      contentType,
    });

    await unlink(tmpFilePath);
    if (!s3Response) throw new Error(`Cannot upload file ${originalFilename}`);
  } catch (e) {
    di.Logger.error(e);
    throw e;
  }

  let transaction;
  try {
    transaction = await testUploadModels.sequelize.transaction();
    const bucket = await testUploadModels.bucket.findOne({ where: { name: DEFAULT_BUCKET_NAME }, transaction });
    result.url += bucket.url;
    let uploadedFile = await testUploadModels.file.findOne({ where: { name: originalFilename }, transaction });
    const NOW = +new Date();
    if (uploadedFile) {
      uploadedFile.size = size;
      await testUploadModels.file.update({ size }, { where: { id: uploadedFile.id, updated_at: NOW }, transaction });
    } else {
      await testUploadModels.file.create({
        name: originalFilename,
        url: originalFilename,
        bucket_id: bucket.id,
      }, { transaction });
    }

    result.url += '/' + originalFilename + '?versionId=' + s3Response.VersionId;

    uploadedFile = await testUploadModels.file.findOne({ where: { name: originalFilename }, transaction });
    await testUploadModels.version.create({
      file_id: uploadedFile.id,
      version_id: s3Response.VersionId,
      size,
      created_at: NOW,
    }, { transaction });

    await transaction.commit();
  } catch (e) {
    if (transaction) {
      await transaction.rollback();
    }

    di.Logger.error(e);
  }

  return result;
};

module.exports = {
  getUploadedFilesList,
  getFileFromS3,
  uploadFile,
};