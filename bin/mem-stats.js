const database = require('../modules/db-connection.js');
const fileName = 'mem-stats.js';
const logger = require('../modules/winston-logger');
const sql = require('mssql');
const scriptExec = require('./script-executor');

async function collectAndWrite() {
    const dbpool = database.getPool();
    try {

        /*const scriptOP = {
            "TIMESTAMP": "2019-01-24 10:10:01",
            "MEM_TYPE": "Mem",
            "TOTAL": 16258848,
            "USED": 2202740,
            "FREE": 1183848
        }*/

        let scriptOP = await scriptExec.executeMemScript();
        logger.info(fileName + ' scriptOP - ' + scriptOP);
        //check for empty JSON
        if (typeof scriptOP == 'undefined') {
            logger.info(fileName + ' scriptOP is empty or null ');
            return;
        }

        let ts = scriptOP['TIMESTAMP'];
        let mt = scriptOP['MEM_TYPE'];
        let t = scriptOP['TOTAL'];
        let u = scriptOP['USED'];
        let f = scriptOP['FREE'];
        logger.info(fileName + ' ts - ' + ts + ' mt ' + mt);
        if (typeof ts == 'undefined' || t == '-1') {

            return;

        }

        let utc = new Date(`${ts}` + ' UTC');
        logger.info(fileName + " utc " + utc);
        let tsET = new Date(utc.getTime() - (utc.getTimezoneOffset() * 60000)); //convert UTC to ET
        let tsl = tsET.toISOString();
        const request = dbpool.request()
        const sqlQuery = `INSERT INTO SERV_MEM_METRICS (TIMESTAMP ,MEM_TYPE ,TOTAL ,USED ,FREE) VALUES ('${tsl}' ,'${mt}','${t}','${u}','${f}')`;
        logger.info(fileName + " sqlQuery  " + sqlQuery);
        const transaction = new sql.Transaction(dbpool)
        transaction.begin(err => {
            if (err) {
                throw err
            }
            const request = new sql.Request(transaction)
            logger.info(fileName + " request " + request);
            request.query(sqlQuery, (err, result) => {
                if (err) {
                    throw err;
                }
                logger.info(result);
                logger.info(fileName + " result " + result);
                transaction.commit(err => {
                    if (err) {
                        throw err
                    }
                    logger.info("Transaction committed.")
                })
            })
        })
    } catch (e1) {
        logger.info('exception - ' + e1);
        logger.info(fileName + " exception - " + e1);
    }

}

module.exports.collectAndWrite = collectAndWrite;
