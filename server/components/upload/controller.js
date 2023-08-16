const formidable = require('formidable');
const service = require('./service');

const getUploadedFilesList = async (req, res) => {
  return res.status(200).send({});
};

const formParse = async (req) => {
  const form = new formidable.IncomingForm({
    maxFileSize: 10 * 1024, //10 KB converted to bytes,
    allowEmptyFiles: false
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      return resolve(files);
    });
  });
};

const uploadFile = async (req, res) => {
  try {
    const files = await formParse(req);
    await service.uploadFile({
      tmpFilePath: files.file[0].filepath,
      originalFilename: files.file[0].originalFilename,
      contentType: files.file[0].mimetype,
    });
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }

  return res.status(200).send({});
};

module.exports = {
  getUploadedFilesList,
  uploadFile,
};