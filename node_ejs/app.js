/*var ejs = require('ejs');

var http = require('http');

var fs = require('fs');

 

http.createServer(function (request, response) {
    fs.readFile('./views/index.ejs', 'utf8', function (error, data) {

        response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });

        response.end(ejs.render(data));

    });

}).listen(3000, function () {

    console.log('Server Running...');

});*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


var server = app.listen(3000, function(){
 console.log("Express server has started on port 3000");
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var index = require('./routes/index');
var users = require('./routes/users');

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;