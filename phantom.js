'use strict';
//var fs = require('fs');
//var request = require('request');
//var path = require('path');
//var folderUpload = __dirname + '/uploads/';
//var cheerio = require('cheerio');
//
//function downloader(url, callback) {
//    var filename = path.basename(url) + '.jpeg';
//    fs.exists(folderUpload + filename, function (exists) {
//        if (!exists) {
//            console.log("Downloading " + url + " ...")
//            return request({
//                url: url + '?fit=crop&fm=jpg&q=75&w=950',
//                encoding: 'binary'
//            }, function (err, response, body) {
//                if (err) {
//                    return callback(err)
//                }
//                fs.writeFile(folderUpload + filename, body, 'binary', function (err) {
//                    if (err) {
//                        return callback(err)
//                    }
//                    callback(null, filename, true)
//                })
//
//            })
//        }
//        callback('File Existed');
//    })
//}
//console.time('download');
//request('https://unsplash.com/', function (req, response, body) {
//    var $ = cheerio.load(body);
//    var arrayImage = $('div.photo a img');
//    console.log(arrayImage.length);
//    var concurrency = 2,
//        running = 0,
//        completed = 0,
//        index = 0;
//    function next() {
//        while (running < concurrency && index < arrayImage.length) {
//            var item = arrayImage[index++];
//            let fullImageLink = $(item).attr('src');
//            let imagelink = fullImageLink.slice(0, fullImageLink.indexOf('?'));
//            //downloader(imagelink, function (err, filename) {
//            //    if (err) {
//            //        return console.log(err);
//            //    }
//            //    console.log(filename + ' downloaded');
//            //    completed++, running--;
//            //    if(completed === arrayImage.length) {
//            //        console.timeEnd('download')
//            //    }
//            //    next();
//            //})
//            running++;
//        }
//    }
//    next()
//})
var