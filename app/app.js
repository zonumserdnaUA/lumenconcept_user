console.log('Init Cluster Express server');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cluster = require('cluster');
var CPU_NUM = require('os').cpus().length;
var workers = require('./helpers/workers');
var fs = require('fs');
var fsmk = require('node-fs');
var properties = require('properties-parser');
var path = require("path");

var logDirectory = path.join(__dirname, 'logs/');
if (!fs.existsSync(logDirectory)) {
    fsmk.mkdirSync(logDirectory, 0666, true);
}
var fileLog = path.join(logDirectory, 'server.log');
var numWorkers = CPU_NUM;


if (cluster.isMaster) {

    fs.writeFileSync(path.join(logDirectory, 'pid.txt'), process.pid + '=master\n');

    fs.appendFileSync(fileLog, '\n\n-------------------------------Initializing workers...\n');
    fs.appendFileSync(fileLog, 'Cluster MASTER starting... PID: ' + process.pid +'. Initializing ' + numWorkers + ' workers!\n');
    console.log('Initializing workers...');
    console.log('Cluster MASTER starting... PID: ' + process.pid +'. Initializing ' + numWorkers + ' workers!');

    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('fork', function (worker) {
        fs.appendFileSync(fileLog, 'Cluster worker PID: ' + worker.process.pid + ' started!\n');
        console.log('Cluster worker PID: ' + worker.process.pid + ' started!');
    });

    cluster.on('listening', function (worker, address) {
        var addressType = 'Unknow';
        if (address.addressType == '4') {
            addressType = 'TCPv4';
        }
        else if (address.addressType == '6') {
            addressType = 'TCPv6';
        }
        else if (address.addressType == '-1') {
            addressType = 'UNIX Domain Socket';
        }
        else if (address.addressType == 'udp4') {
            addressType = 'UDP4';
        }
        else if (address.addressType == 'udp6') {
            addressType = 'UDP6';
        }

        if (!address.address) {
            address.address = 'localhost';
        }

        fs.appendFileSync(path.join(logDirectory, 'pid.txt'), worker.process.pid + '=worker' + '\n');
        fs.appendFileSync(fileLog, 'Cluster worker PID: ' + worker.process.pid + ' listening! the worker is now connected to ' + address.address + ':' + address.port + ' [type: ' + addressType + ']\n');
        console.log('Cluster worker PID: ' + worker.process.pid + ' listening! the worker is now connected to ' + address.address + ':' + address.port + ' [type: ' + addressType + ']');
    });

    cluster.on('disconnect', function (worker) {
        fs.appendFileSync(fileLog, 'Cluster worker PID: ' + worker.process.pid + ' disconnected!\n');
        console.log('Cluster worker PID: ' + worker.process.pid + ' disconnected!');
    });

    cluster.on('exit', function (worker, code, signal) {
        properties.read(path.join(logDirectory, 'pid.txt'), function (error, data) {
            if (!error) {
                fs.writeFileSync(path.join(logDirectory, 'pid.txt'), '');
                for (var item in data) {
                    if (item != worker.process.pid) {
                        fs.appendFileSync(path.join(logDirectory, 'pid.txt'), item + '=' + data[item] + '\n');
                    }
                }
            }
        });

        workers.removeWorker(worker);

        fs.appendFileSync(fileLog, 'Cluster worker PID: ' + worker.process.pid + ' killed! [details - code: ' + code + ', signal: ' + signal + ']\n');
        console.log('Cluster worker PID: ' + worker.process.pid + ' killed! [details - code: ' + code + ', signal: ' + signal + ']');
        if (worker.suicide === false) {
            fs.appendFileSync(fileLog, 'Starting a new worker...\n');
            console.log('Starting a new worker...');
            cluster.fork();
        }
    });
}
else {
    workers.workerRegister(cluster.worker);

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
    app.use(bodyParser.json());
    //app.use(require('./middlewares/users'));
    app.use(require('./controllers/userController'));

    var pathFiles = path.join(__dirname, 'files');
    if (process.env && process.env.VOX_USE_FILE_SERVER) {
        pathFiles = path.join('Z:');
    }
    app.use(express.static(pathFiles));

    app.listen(3001, function() {
        console.log('Listening on port 3001...')
    });
}