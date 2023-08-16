const ENV = 'development';

module.exports = {
  env: ENV,
  tz: 'UTC',
  host: '',
  port: 3000,
  logger: {
    display_listening_on_port: true,
    log_levels: {
      info: true,
      warning: true,
      error: true,
      fatal: true,
      debug: true,
    },
  },
};
