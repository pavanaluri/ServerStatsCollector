const schedulerDemon = require('./scheduler.js');
const database = require('../modules/db-connection.js');
const logger = require('../modules/winston-logger.js');

async function startup() {
  logger.info('Starting B2B Server Stats collector Deamon at - ' + new Date());
   // info or below is written to console and debug or below is written to log file 

  try {
    logger.info('Initializing database module');
    await database.initialize();
  } catch (err) {
    logger.error(err);
    process.exit(1); // Non-zero failure code
  }

  try {
    logger.info('Initializing scheduler deamon');
    //can have individual scheduler for each service or combine them
    await schedulerDemon.run();
    logger.info('Scheduler deamon is RUNNING');
  } catch (err) {
    logger.error(err);
    process.exit(1); // Non-zero failure code
  }

}

startup();
async function shutdown(e) {
  let err = e;

  logger.info('Shutting down scheduler deamon');

  try {
    logger.info('Closing database module');
    await database.close();
  } catch (e) {
    logger.error(e);

    err = err || e;
  }

  logger.info('Exiting process');

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM');
  shutdown();
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT');
  shutdown();
});

process.on('uncaughtException', err => {
  logger.info('Uncaught exception');
  logger.error(err);
  shutdown(err);
});