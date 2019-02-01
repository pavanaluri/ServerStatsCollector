const fileName = 'script-executor.js';
const exec = require('child_process').exec;
const logger = require('../modules/winston-logger');

function executeCPUScript() {

    return new Promise(function (resolve, reject) {
        let data = {
            "TIMESTAMP": "",
            "CPU": "",
            "USER_PERCENTAGE": "-1",
            "SYS_PERCENTAGE": "",
            "IDLE_PERCENTAGE": ""
        }

        const { startDate: sd, startHr: st, endDate: ed, endHr: et } = getDates();
        let command = `sadf -s ${st} -e ${et} -j `; //this command out put is in JSON format
        logger.debug(fileName + ' executeCPUScript() command: ' + command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            //logger.debug(fileName + ' executeCPUScript() stdout: ' + stdout);
            let stdout1 = JSON.parse(stdout);
            //logger.debug(stdout.sysstat);
           // logger.debug(fileName + ' executeCPUScript() stdout1.sysstat.hosts[0]: ' + stdout1.sysstat.hosts[0]);
            //logger.debug(fileName + ' executeCPUScript() stdout1.sysstat.hosts[0].statistics[0]: ' + stdout1.sysstat.hosts[0].statistics[0]);

            if (stdout1.sysstat.hosts[0].statistics.length != 0 && stdout1.sysstat.hosts[0].statistics[0] !== 'undefined') {

                let ts = stdout1.sysstat.hosts[0].statistics[0].timestamp;
                // "timestamp": {"date": "2019-01-24", "time": "16:30:01", "utc": 0, "interval": 600},
                let metrics = stdout1.sysstat.hosts[0].statistics[0]["cpu-load"][0];
                //{"cpu": "all", "user": 0.62, "nice": 0.00, "system": 0.35, "iowait": 0.00, "steal": 0.00, "idle": 99.03}

                //logger.debug(fileName + ' executeCPUScript() ts: ' + JSON.stringify(ts));
                //logger.debug(fileName + ' executeCPUScript() metrics: ' + JSON.stringify(metrics));

                if (typeof ts == 'undefined' || typeof metrics == 'undefined') {
                    return {}
                }
                data.TIMESTAMP = ts.date + ' ' + ts.time;
                //logger.debug(fileName + ' executeCPUScript() data.TIMESTAMP: ' + data.TIMESTAMP);
                data.CPU = metrics.cpu;
                data.USER_PERCENTAGE = metrics.user;
                data.SYS_PERCENTAGE = metrics.system;
                data.IDLE_PERCENTAGE = metrics.idle;
                logger.debug(fileName + ' executeCPUScript() data: ' + JSON.stringify(data));
            }
            resolve(data);
        });
    });

}

module.exports.executeCPUScript = executeCPUScript

function executeMemScript() {

    return new Promise(function (resolve, reject) {

        let data = {
            "TIMESTAMP": "",
            "MEM_TYPE": "",
            "TOTAL": -1,
            "USED": 0,
            "FREE": 0
        }
        const { startDate: sd, startHr: st, endDate: ed, endHr: et } = getDates();
        let command = `sadf -s ${st} -e ${et} -j -- -r`;
        logger.debug(fileName + ' executeMemScript() command: ' + command);
        exec(command,
            (error, stdout, stderr) => {
                //logger.debug(`${stdout}`);
                //logger.debug(stdout);
                if (error !== null) {
                    logger.error(fileName + ' executeMemScript() exec error: ' + error);
                    return {}
                }

                if (typeof stdout == 'undefined') {
                    logger.debug(fileName + ' executeMemScript() No Output from script');
                    return {}
                }
                //logger.debug(fileName + ' executeMemScript() stdout - ' + stdout);
                let stdout2 = JSON.parse(stdout);
                //logger.debug(stdout.sysstat);
                //logger.debug(stdout.sysstat.hosts[0]);
                //logger.debug(fileName + ' executeMemScript() ' + stdout2.sysstat.hosts[0].statistics[0]);

                if (stdout2.sysstat.hosts[0].statistics.length != 0 && stdout2.sysstat.hosts[0].statistics[0] !== 'undefined') {

                    let ts = stdout2.sysstat.hosts[0].statistics[0].timestamp;
                    // "timestamp": {"date": "2019-01-24", "time": "16:30:01", "utc": 0, "interval": 600},
                    let metrics = stdout2.sysstat.hosts[0].statistics[0].memory;
                    // "memory": {"memfree": 1098816, "memused": 15160032, "memused-percent": 93.24, "buffers": 456, "cached": 11908596, "commit": 2832912, "commit-percent": 15.43, "active": 7671044, "inactive": 6189336, "dirty": 20}
                    //logger.debug(fileName + ' executeMemScript() ts: ' + ts);
                    //logger.debug(fileName + ' executeMemScript() metrics: ' + metrics);

                    if (typeof ts == 'undefined' || typeof metrics == 'undefined') {
                        return;
                    }

                    data.TIMESTAMP = ts.date + ' ' + ts.time;
                    data.MEM_TYPE = 'mem';
                    data.TOTAL = (metrics.memused + metrics.memfree);
                    data.USED = metrics.memused;
                    data.FREE = metrics.memfree;
                    logger.debug(fileName + ' executeCPUScript() data: ' + JSON.stringify(data));
                }
                resolve(data);
            });
    });
}

module.exports.executeMemScript = executeMemScript

function getDates() {

    let startDate;
    let endDate;
    let currentDate = new Date();
    let tenMinAgo = new Date(currentDate);
    tenMinAgo.setMinutes(currentDate.getMinutes() - 20);//15 min ago
    let fiveMinAfter = new Date(currentDate);
    fiveMinAfter.setMinutes(currentDate.getMinutes() + 5) //+5 min
    let year = currentDate.getFullYear();
    let m = currentDate.getMonth();
    let mo = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    let month = mo[m];
    let date = currentDate.getDate();

    startDate = year.toString() + '-' + month + '-' + date.toString();
    endDate = startDate;

    let startHr = ('0' + tenMinAgo.getHours()).slice(-2) + ':' + ('0' + tenMinAgo.getMinutes()).slice(-2) + ':' + '00';
    let endHr = ('0' + currentDate.getHours()).slice(-2) + ':' + ('0' + currentDate.getMinutes()).slice(-2) + ':' + '00';
    return { startDate, startHr, endDate, endHr };
}

module.exports.getDates = getDates