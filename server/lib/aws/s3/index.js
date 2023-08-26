const di = require('./../../../di').container;
const config = require('config');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');

const DEFAULT_BUCKET_NAME = config.get('aws.s3.file_upload.bucket_name');

const client = new S3Client({
  apiVersions: '2012-08-10',
  region: config.get('aws.s3.region'),
  credentials: {
    accessKeyId: config.get('aws.s3.access_key_id'),
    secretAccessKey: config.get('aws.s3.secret_access_key')
  }
});

/**
 * @param params = {
 *   bucket: {String} optional
 *   path: {String} required, specifies Key in the bucket
 *   data: {String | Stream}
 *   contentType: {String} optional
 * }
 * @returns {Promise<void>}
 */
const putObject = async (params) => {
  const {
    bucket = DEFAULT_BUCKET_NAME,
    path,
    data,
    contentType = 'application/json',
  } = params;

  let s3Response;
  di.Logger.debug(`START: putObject to ${bucket}/${path}`);
  try {
    const putParams = {
      Bucket: bucket,
      Key: path,
      Body: data,
      ContentType: contentType,
    };

    const putCommand = new PutObjectCommand(putParams);
    s3Response = await client.send(putCommand);
  } catch (e) {
    di.Logger.error(e);
  }

  di.Logger.debug('END: putObject');

  return s3Response;
};

/**
 * @param params = {
 *   bucket: {String} optional
 *   path: {String} required, specifies Key in the bucket
 *   responseType: {String} optional (can be 'string' or 'stream'. Default value 'string')
 * }
 * @returns {Promise<void>}
 */
const getObject = async (params) => {
  const {
    bucket = DEFAULT_BUCKET_NAME,
    path,
    responseType = 'string'
  } = params;

  di.Logger.debug(`START: getObject from ${bucket}/${path}`);

  let result;
  try {
    const getParams = {
      Bucket: bucket,
      Key: path,
    };

    const getCommand = new GetObjectCommand(getParams);
    const response = await client.send(getCommand);
    if (responseType === 'string') {
      result = await response.Body.transformToString();
    } else if (responseType === 'stream') {
      result = await response.Body;
    } else {
      throw new Error(`responseType "${responseType}" is incorrect. Can be only 'string' or 'stream'.`);
    }
  } catch (e) {
    di.Logger.error(e);
    result = { error: e };
  }

  di.Logger.debug('END: getObject');

  return result;
};

module.exports = {
  putObject,
  getObject,
};
