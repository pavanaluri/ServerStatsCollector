const fs = require('fs');
const logger = require('../modules/winston-logger');
//var pkg = require('../package.json');
let configData = null;

function getConfigData() {

    // if the static data was already set. return it
    if (configData != null && configData != undefined) {
        return configData
    }

    configData = {};

    let env = process.env.npm_package_config_env;
    logger.info('config_env= ' + env);
    //console.log('env = '+pkg.config.env);
    //LOAD JSON
    if (env === undefined || env == null || env == 'DEV') {
        let rawdata = fs.readFileSync(__dirname + '/dev-conf.json', 'utf-8');
        configData = JSON.parse(rawdata);
        return configData;
    } else {
        if (env == 'PROD') {
            let rawdata = fs.readFileSync(__dirname + '/prod-conf.json', 'utf-8');
            configData = JSON.parse(rawdata);
            return configData;
        }
    }

    //LOAD FROM ENV VARIABLES
    //config_data.port = process.env.port || config_data.port

};

module.exports.getConfigData = getConfigData;
