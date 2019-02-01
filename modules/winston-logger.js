var winston = require('winston');
var appRoot = require('app-root-path');
const moment = require('moment-timezone');

var options = {
  file: {
    level: 'debug',
    filename: `${appRoot}/logs/Applogs.log`,
    handleExceptions: true,
    json: false,
    maxsize: 2097152, // 2MB
    maxFiles: 100,
    colorize: true,
  },
  errorFile: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 2097152, // 2MB
    maxFiles: 100,
    colorize: true,
  },
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
  }
};

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const localTimestamp = format((info, opts) => {
    info.timestamp = moment().tz('America/New_York').format("YYYY-MM-DD HH:mm:ss z");
  return info;
});

let logger = createLogger({
  format: combine(
    label({ label: 'b2b-dash-ssc' }),
    localTimestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.File(options.errorFile),
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
});

//below stream function will get the morgan-generated output into the winston log files
logger.stream = {
  write: function (message, encoding) {
    logger.debug(message.slice(0, -1));
  },
};
module.exports = logger;
