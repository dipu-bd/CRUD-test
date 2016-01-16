var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.listen(3000, function(err) {
    if(!err) console.log("Listening on http://localhost:3000/");
});

//
// API to add and query student database
//
app.post('/add', function(req, res){
    
});

app.get('/query', function(req, res){

});