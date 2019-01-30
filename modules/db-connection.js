const sql = require('mssql');
const appConfig = require('../config/config.js');
const logger = require('./winston-logger.js');
const fileName = 'db-connection.js';
let pool;


async function initialize() {
  logger.info(fileName + ' calling appConfig.getConfigData()');
  let confdata = appConfig.getConfigData();
  let dbdata = confdata.db;
  logger.info(fileName + 'dbdata = ' + dbdata);
  logger.info(fileName + 'DB User = ' + dbdata.user);
  pool = await sql.connect(dbdata);
}

module.exports.initialize = initialize;

function getPool() {
  return pool;
}

module.exports.getPool = getPool;

async function close() {
  //await oracledb.getPool().close();
  logger.info(fileName + ' - closing connection pool ' + pool);
  pool.close();
}

module.exports.close = close;
