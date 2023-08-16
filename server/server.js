const { Reset, FgBlack, BgYellow } = require('./lib/consoleColors');
const config = require('config');
const app = require('./app');
const di = require('./di').container;

if (!config.get('env')) {
  di.Logger.error('NODE_ENV not set');
  process.exit(1);
}

if (config.get('tz') !== 'UTC') {
  di.Logger.error('UTC time zone not set');
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  di.Logger.error('Uncaught exception', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  di.Logger.error('Unhandled rejection', reason);
  process.exit(1);
});

const createServer = async () => {
  try {

    // Create a new Express application.
    const http = require('http').Server(app);

    http.on('listening', function handleServerListening () {
      const addr = http.address();
      const bind = typeof addr === 'string' ? 'Pipe ' + addr : 'Port ' + addr.port;

      if (config.get('logger.display_listening_on_port')) {
        // eslint-disable-next-line no-console
        console.log(BgYellow, FgBlack, `Listening on ${bind}`, Reset);
      }
    });

    return {
      server: http,
      app: di.app
    };
  } catch (err) {
    di.Logger.error(err);
  }
};

const serverPromise = createServer();

const getServer = async () => {
  const instances = await serverPromise;
  return instances;
};

module.exports = {
  getServer
};
