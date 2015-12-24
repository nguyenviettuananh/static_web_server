/**
 * Created by tuananh on 12/14/15.
 */
'use strict';
const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn
const path = require('path');
var slug = require('slug');
var print = console.log.bind(console, '>');
//request('http://vechai.info/',function(err,response,html){
//    if(!err && response.statusCode == 200){
//        var $ = cheerio.load(html);
//        var i = $(".NewsList li a");
//        for(var j = 0; j < i.length; j++){
//           var link = i[j].attribs.href;
//            console.log(link);
//        }
//    }
//})
//n
function crawl_comic(link,id1,id2,id3){
    request(link,function(err,response,html){
        if(!err && response.statusCode == 200){
            var $ = cheerio.load(html);
            var i = $(id1);
            var i3 = i[Math.floor((Math.random() * i.length) + 1)].attribs;
            var title = slug(i3.title.replace(/ /g,"_"));
            fs.exists(__dirname+'/public/img/'+title,function(exists){
                if(!exists){
                    fs.mkdir(__dirname+'/public/img/'+title,function(err){
                        if(err) throw err;
                        console.log(title + " created");
                    })
                }
            })
            request(i3.href,function(err,response,html){
                var $ = cheerio.load(html);
                var i = $(id2);
                var i3 = i[Math.floor((Math.random() * i.length) + 1)].attribs;
                var chap = slug(i3.title.replace(/ /g,"_"));
                fs.exists(__dirname+'/public/img/'+title+"/"+chap,function(exists){
                    if(!exists) {
                        fs.mkdir(__dirname + '/public/img/' + title + "/" + chap, function (err) {
                            if (err) throw err;
                            console.log(chap + " created");
                        })
                    }
                    request(i3.href,function(err,response,html){
                        var $ = cheerio.load(html);
                        var i = $(id3);
                        for(var j = 0; j < i.length ; j++){
                            var img = i[j].attribs.src;
                            console.time('download');
                            request.get(img)
                                        .on('error', function(err) {
                                            console.log('Download error', err);
                                        })
                                        .pipe(fs.createWriteStream(__dirname+'/public/img/'+title+"/"+chap+"/"+url.parse(img).pathname.split('/').pop())
                                            .on('finish', function(){
                                                console.timeEnd('download');
                                                console.log('Done write to file');
                                            }).on('error', function(err){
                                        console.log('Error write to file: ', err);
                                    })
                            );
                        }
                    })
                })
                //request(i3.href,function(err,response,html){
                //    var $ = cheerio.load(html);
                //    var i = $(id3);
                //    for(var j = 0; j < i.length ; j++){
                //        var img = i[j].attribs.src;
                //        console.time('download');
                //        request.get(img)
                //            .on('error', function(err) {
                //                console.log('Download error', err);
                //            })
                //            .pipe(fs.createWriteStream(__dirname+'/public/img/'+title+"/"+chap+"/"+url.parse(img).pathname.split('/').pop())
                //                .on('finish', function(){
                //                    console.timeEnd('download');
                //                    console.log('Done write to file');
                //                }).on('error', function(err){
                //                    console.log('Error write to file: ', err);
                //                })
                //        );
                //    }
                //})
            })
            //for (var j = 0; j<i.length; j++){
            //    var href = i[j].attribs.href;
            //}
        }
    })
}
crawl_comic("http://vechai.info/danh-sach.tmoinhat.html","#comic-list li .StoryName",".IndentOut li a","#contentChapter img");