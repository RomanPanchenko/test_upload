const bottle = require('bottlejs').pop('app');
const logger = require('./lib/logger');

bottle.service('Logger', function () {
  return logger.log;
});

module.exports = bottle;
