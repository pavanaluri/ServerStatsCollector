const appConfig = require('../config/config.js');
const fileName = 'scheduler.js';
const logger = require('../modules/winston-logger');
const cpuStats = require('./cpu-stats.js');
const memStats = require('./mem-stats.js');

function run() {
    return new Promise(async (resolve, reject) => {
        try {
            let confdata = appConfig.getConfigData();
            const cpuMetricsConfig = confdata.cpuMetrics;
            const memMetricsConfig = confdata.memoryMetrics;

            if (cpuMetricsConfig.isEnabled) {
                logger.info(fileName + ' CPU Metrics deamon is enabled');
                await setInterval(cpuStats.collectAndWrite, cpuMetricsConfig.scanFrequencyMS);
                //await setInterval(cpuStats.getAndWrite, 10000);
                //await cpuStats.getAndWrite();
            }

            if (memMetricsConfig.isEnabled) {
                logger.info(fileName + ' Memory Metrics deamon is enabled');
                await setInterval(memStats.collectAndWrite, cpuMetricsConfig.scanFrequencyMS);
            }

        } catch (err) {
            logger.log(err);
            reject(err);
            return;
        }
        resolve();
    }
    );
}

module.exports.run = run;
