var ejs = require('ejs');

var http = require('http');

var fs = require('fs');

 

http.createServer(function (request, response) {
    fs.readFile('./views/index.ejs', 'utf8', function (error, data) {

        response.writeHead(200, { 'Content-Type': 'text/html' });

        response.end(ejs.render(data));

    });

}).listen(3000, function () {

    console.log('Server Running...');

});
