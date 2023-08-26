const { getUploadedFilesList, getFileFromS3, uploadFile } = require('./controller');

module.exports = (router) => {
  router.get('/list', getUploadedFilesList);
  router.get('/content/:fileId/:versionId', getFileFromS3);
  router.post('/', uploadFile);

  return router;
};