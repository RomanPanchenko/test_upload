const formidable = require('formidable');
const service = require('./service');

const getUploadedFilesList = async (req, res) => {
  const uploadedFiles = await service.getUploadedFilesList();
  return res.status(200).send(uploadedFiles);
};

const getUploadedFileById = async (req, res) => {
  const { fileContent, fileName } = await service.getUploadedFileById(req.params.fileId);

  res.header('Content-Type', 'text/csv');
  res.attachment(fileName);
  return res.send(fileContent);
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
    const { filepath: tmpFilePath, originalFilename, mimetype: contentType, size } = files.file[0];
    await service.uploadFile({ tmpFilePath, originalFilename, contentType, size });
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }

  return res.status(200).send({});
};

module.exports = {
  getUploadedFilesList,
  getUploadedFileById,
  uploadFile,
};