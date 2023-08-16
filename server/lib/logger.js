const config = require('config');
const env = config.get('env');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, splat, errors } = format;
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const logger = createLogger({
  level: 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    splat(),
    format.printf(function (info) {
      return `${info.timestamp} [${info.level}]: ${info.message}` +
        (typeof info.splat !== 'undefined' ? `${info.splat}` : ' ') +
        (typeof info.stack !== 'undefined' ? ('\n' + info.stack) : '');
    })
  ),
  transports: [
    new DailyRotateFile({
      dirname: 'tmp',
      filename: 'datavju.error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error'
    }),
    new DailyRotateFile({ dirname: 'tmp', filename: 'datavju-%DATE%.log', datePattern: 'YYYY-MM-DD' })
  ]
});

if (env !== 'production-TODO') {
  logger.add(new transports.Console({
    level: 'debug'
  }));
}

module.exports = {
  reportTime: h => ((h[0] * 1e9 + h[1]) / 1e9) + 's',
  log: logger,
  asyncHandler: handler => {
    return function (req, res, next) {
      return Promise
        .resolve(handler(req, res, next))
        .catch(err => {
          next(err);
        });
    };
  },
  getFilesInDirSync: (dir, ext, exludes = []) => {
    return fs.readdirSync(dir)
      .filter(file => file.endsWith(ext) && !exludes.includes(file))
      .map(file => path.join(dir, file));
  }
};
