var winston = require('winston');
var appRoot = require('app-root-path');

var options = {
  file: {
    level: 'info',
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
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

let logger = createLogger({
  format: combine(
    label({ label: 'p2p-API' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.File(options.errorFile),
    new winston.transports.File(options.file)
  ],
  exitOnError: false
});

//below stream function will get the morgan-generated output into the winston log files
logger.stream = {
  write: function (message, encoding) {
    logger.info(message.slice(0, -1));
  },
};
module.exports = logger;
