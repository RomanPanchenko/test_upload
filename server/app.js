const app = require('express')();
const router = require('express-promise-router')();
var cors = require('cors')
const { Logger } = require('./di').container;

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  let message;
  const acceptEncodingIndex = req.rawHeaders.findIndex(p => p === 'accept-encoding');
  if (acceptEncodingIndex >= 0) {
    if (req.rawHeaders[acceptEncodingIndex + 1] === 'gzip, deflate') {
      message = `${req.method}: ${req.url}`;
      Logger.debug(message);
      return next();
    }
  }

  message = `${req.method}: ${req.url}`;
  if (req.params && typeof req.params === 'object' && Object.keys(req.params).length) {
    message += `\n params: ${JSON.stringify(req.params)}`;
  }

  if (req.query && typeof req.query === 'object' && Object.keys(req.query).length) {
    message += `\n params: ${JSON.stringify(req.query)}`;
  }

  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length) {
    message += `\n params: ${JSON.stringify(req.body)}`;
  }

  Logger.debug(message);

  next();
});

app.use(router);
// - ROUTES
router.use('/upload', require('./components/upload/api')(router));

app.get('/status', (req, res) => res.status(200).send('Status is OK'));

module.exports = app;
