var express = require('express');
var fs = require('fs');
var http = require('http');
var morgan = require('morgan');
var path = require('path');
//process
var app = express();
// Constants
var port = 3000;
var logDirectory = 'log';
// Graceful start
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
// Logging
var accessLogStream = fs.createWriteStream(path.join(logDirectory, 'node-log.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
// API endpoint to return "Hello World" message
app.get('/', function (req, res) {
    // create random number between 0 and 1000000
    var randomNumber = Math.floor(Math.random() * 1000000);
    // res send 'Hello World' with random number
    res.send("Hello World ".concat(randomNumber));
    // merge request ip, method and response to log to morgan
    accessLogStream.write("".concat(req.ip, " ").concat(req.method, " ").concat(res.statusCode, " ").concat(randomNumber));
});
// Health endpoint
app.get('/health', function (req, res) {
    res.sendStatus(200);
});
// Create HTTP server
var server = http.createServer(app);
// Graceful stop
process.on('SIGTERM', function () {
    console.log('Received SIGTERM, shutting down gracefully');
    server.close(function () {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
});
// Start the server
server.listen(port, function () {
    console.log("Server is listening on port ".concat(port));
});
