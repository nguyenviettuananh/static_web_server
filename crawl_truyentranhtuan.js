'use strict';
const request = require('request');
const url = require('url');
const fs = require('fs');
var slug = require('slug');
const cheerio = require("cheerio");
//var childProcess = require('child_process');
//var phantomjs = require('phantomjs');
//var binPath = phantomjs.path;
function crawl_truyentranhtuan() {
    request("http://truyentranhtuan.com/shingeki-no-kyojin-chuong-76/", function (err, response, html) {
        if(err) console.log(err);
        var $ = cheerio.load(html);
        var i = $("#hot-manga");
        //console.log(i);
        var str = /(\[\")(.*)(\]\;)/g;
        var res = html.match(str);
        res = res[0];
        res = res.slice(2,res.length-2);
        res = res.split(",");
        res[0] = "\""+res[0];
        for(var i = 0; i<res.length; i++){
            res[i] = res[i].slice(1,res[i].length-1)
            //console.log(url.parse(res[i]).pathname.split("/"));
            //console.log(url.parse(res[i]));
            console.time('download');
            request.get(res[i])
                .on('error', function(err) {
                    console.log('Download error', err);
                })
                .pipe(fs.createWriteStream(__dirname+'/img/'+url.parse(res[i]).pathname.split('/').pop())
                    .on('finish', function(){
                        console.timeEnd('download');
                        console.log('Done write to file');
                    }).on('error', function(err){
                        console.log('Error write to file: ', err);
                    })
            );
        }
    })
}
crawl_truyentranhtuan();