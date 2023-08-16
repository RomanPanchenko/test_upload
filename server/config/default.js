const ENV = process.env.NODE_ENV;

module.exports = {
  env: ENV,
  tz: 'UTC',
  host: '',
  port: 3000,
  db: {
    dialect: 'mysql',
    dialectOptions: {
      multipleStatements: true,
    },
    timezone: '+00:00',
    username: 'root',
    password: '',
    database: 'test_upload',
    host: 'mysqldb',
    port: 3306,
    logging: false,
  },
  logger: {
    display_listening_on_port: true,
    log_levels: {
      info: false,
      warning: false,
      error: true,
      fatal: true,
      debug: false,
    },
  },
  aws: {
    s3: {
      region: 'eu-central-1',
      access_key_id: '',
      secret_access_key: '',
      file_upload: {
        bucket_name: 'rpanchenko123-test-upload-bucket',
        role_arn: 'arn:aws:iam::073487192952:role/TEST-UPLOAD-API-ROLE',
      }
    }
  },
};
