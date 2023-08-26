const { getUploadedFilesList, getUploadedFileById, uploadFile } = require('./controller');

module.exports = (router) => {
  router.get('/uploaded-files/', getUploadedFilesList);
  router.get('/file-content/:fileId', getUploadedFileById);
  router.post('/upload/', uploadFile);

  return router;
};