//requirements
var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var database = require('./database.js');

//create express app
var app = express();
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', 3000);

//run server
var port = 3000;
app.set('port', port);
var server = http.createServer(app);
server.on('listening', function (err) {
    if (!err) console.log("Listening on http://localhost:" + port + "/");
});
server.listen(port);

//
// response to web query
//
app.post('/list', function (request, response) {
    database.allStudents(function (err, res) {
        if (err) response.send(404, err);
        else response.send(200, {result: res});
    });
});
app.post('/add', function (request, response) {
    var student = request.body;
    database.addStudent(student.student_name, student.regno, student.cgpa, function (err, res) {
        if (err) response.send(404, err);
        else response.send(200, {result: res});
    });
});
app.post('/edit', function (request, response) {
    var student = request.body;
    database.updateStudent(student.student_id, student.student_name, student.regno, student.cgpa, function (err, res) {
        if (err) response.send(404, err);
        else response.send(200, {result: res});
    });
});
app.post('/delete', function (request, response) {
    var student_id = request.body.student_id;
    database.deleteStudent(student_id, function (err, res) {
        if (err) response.send(404, err);
        else response.send(200, {result: res});
    });
});
app.post('/query', function (request, response) {
    var query = request.body.query;
    database.runQuery(query, function (err, res) {
        if (err) response.send(404, err);
        else response.send(200, {result: res});
    });
});