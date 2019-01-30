const database = require('../modules/db-connection.js');
const fileName = 'cpu-stats.js';
const logger = require('../modules/winston-logger');
const sql = require('mssql');
const scriptExec = require('./script-executor');


async function collectAndWrite() {
    const dbpool = database.getPool();
    try {

        /*const scriptOP = {
            "TIMESTAMP": "2019-01-01 00:10:00",
            "CPU": "ALL",
            "USER_PERCENTAGE": "1.0",
            "SYS_PERCENTAGE": "2.5",
            "IDLE_PERCENTAGE": "97.5"
        }*/
        let scriptOP = await scriptExec.executeCPUScript();
        logger.debug(fileName + ' scriptOP - ' + scriptOP);
        //check for empty JSON
        if (typeof scriptOP == 'undefined') {
            logger.debug(fileName + ' scriptOP is empty or null ');
            return;
        }
        let ts = scriptOP['TIMESTAMP'];
        let cpu = scriptOP['CPU'];
        let up = scriptOP['USER_PERCENTAGE'];
        let sp = scriptOP['SYS_PERCENTAGE'];
        let ip = scriptOP['IDLE_PERCENTAGE'];
        logger.debug(fileName + ' ts - ' + ts + ' cpu ' + cpu);
        if (typeof ts == 'undefined' || up == '-1') {

            return;

        }

        let utc = new Date(`${ts}` + ' UTC');
        logger.debug(fileName + " utc " + utc);
        let tsET = new Date(utc.getTime() - (utc.getTimezoneOffset() * 60000)); //convert UTC to ET
        let tsl = tsET.toISOString();
        const request = dbpool.request()
        const sqlQuery = `INSERT INTO B2B_DASH_SERV_CPU_METRICS (TIMESTAMP ,CPU ,USER_PERCENTAGE ,SYS_PERCENTAGE ,IDLE_PERCENTAGE) VALUES ('${tsl}','${cpu}',CAST('${up}' AS FLOAT),CAST('${sp}' AS FLOAT),CAST('${ip}' AS FLOAT))`;
        logger.debug(fileName + " sqlQuery  " + sqlQuery);
        const transaction = new sql.Transaction(dbpool)
        transaction.begin(err => {
            if (err) {
                throw err
            }
            const request = new sql.Request(transaction)
            logger.debug(fileName + " request " + request);
            request.query(sqlQuery, (err, result) => {
                if (err) {
                    throw err;
                }
                logger.debug(result);
                logger.debug(fileName + " result " + result);
                transaction.commit(err => {
                    if (err) {
                        throw err
                    }
                    logger.debug("Transaction committed.")
                })
            })
        })
    } catch (e1) {
        logger.debug(fileName + ' exception - ' + e1);
        logger.debug(fileName + " exception - " + e1);
    }

}

module.exports.collectAndWrite = collectAndWrite;
