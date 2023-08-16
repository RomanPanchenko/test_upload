const { getUploadedFilesList, uploadFile } = require('./controller');

module.exports = (router) => {
  router.get('/', getUploadedFilesList);
  router.post('/', uploadFile);

  return router;
};