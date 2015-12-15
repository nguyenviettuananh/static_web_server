/**
 * Created by thanhvk on 12/13/15.
 */
'use strict';

var http = require('http'),
    url = require('url'),
    mime = require('mime'),
    fs = require('fs'),
    path = require('path'),
    baseDir = path.join('./public');

// Create handlerGetRequest function
function handlerGetRequest(req, res) {
    if (req.method === 'GET') {
        let pathname = url.parse(req.url).pathname;
        let contentType = mime.lookup(pathname);

        if (pathname === '/') {
            fs.readdir(baseDir, function (err, files) {
                res.writeHead(200, { 'Content-Type': 'text/html' });

                for (var i = 0; i < files.length; i++) {
                    res.write('<a href=' + files[i] + '>' + files[i] + '</a><br>');
                }

                res.end();
            })
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(baseDir + pathname).pipe(res);
        }
    }
}

// Create a server call handlerGetRequest
// function when emit 'request' event
let server = http.createServer();
server.on('request', function (req, res) {
    handlerGetRequest(req, res);
});

server.listen(3000);
console.log('Sever running at port 3000');