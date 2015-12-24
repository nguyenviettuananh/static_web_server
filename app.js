/**
 * Created by thanhvk on 12/13/15.
 */
'use strict';

var http = require('http'),
    url = require('url'),
    mime = require('mime'),
    fs = require('fs'),
    path = require('path'),
    baseDir = '.';
var slug = require('slug');
var print = console.log.bind(console, '>');
// Create res404 function
function res404(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('Can\'t not handler ' + req.method + ' ' + req.url);
    res.end();
}

// Create resFileHighlight function
function resFileHighlight(res, pathname, ext) {
    fs.readFile('index.html', 'utf-8', function (err, index) {
        if(err) throw err;

        fs.readFile(baseDir + pathname, 'utf-8', function (err, file) {
            if (err) throw err;

            // Replace '<' '>' with '&lt;' '&gt;'
            file = file.replace(/</g, '&lt;');
            file = file.replace(/>/g, '&gt;');
            file = '<pre> <code class=' + ext + '>' + file + '</code></pre>';

            index = index.replace('{{ file }}', file);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(index);
            res.end();
        });
    });
}

// Create serveStaticFile function
function serveStaticFile(req, res, pathname) {
    let contentType = mime.lookup(pathname),
        ext = mime.extension(contentType);

    switch(ext) {
        case 'html':
            resFileHighlight(res, pathname, ext);
            break;
        case 'js':
            resFileHighlight(res, pathname, ext);
            break;
        case 'json':
            resFileHighlight(res, pathname, ext);
            break;
        default:
            res.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(baseDir + pathname).pipe(res);
    }
}

// Create handlerGetRequest function
function handlerGetRequest(req, res) {
    if (req.method === 'GET') {
        let pathname = url.parse(req.url).pathname;

        if (pathname === '/') {
            fs.readdir(baseDir, function (err, files) {
                res.writeHead(200, { 'Content-Type': 'text/html' });

                for (var i = 0; i < files.length; i++) {
                    res.write('<a href=' + files[i] + '>' + files[i] + '</a><br>');
                }

                res.end();
            })
        } else if (pathname != '/favicon.ico') {
            fs.stat(baseDir + pathname, function (err, stats) {
                if (err) {
                    res404(req, res);
                    return;
                }

                if (stats.isFile()) {
                    serveStaticFile(req, res, pathname);
                } else if (stats.isDirectory()) {
                    fs.readFile("index.html",function(err,index){
                        fs.readdir(baseDir + pathname, function (err, files) {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            for (var i = 0; i < files.length; i++) {
                                index = index +'<a href='+ pathname + '/' + files[i].replace(/ /g,"_") + '>' + files[i] + '</a><br>';
                            }
                            index = index.replace("{{ file }}", "");
                            res.write(index);
                            res.end();
                        })
                    })
                } else {
                    res404(req, res);
                }
            });
        }
    } else {
        res404(req, res);
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