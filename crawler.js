'use strict';
const request = require('request');
const url = require('url');
const fs = require('fs');
let promise = require('bluebird');
let requestPromise = require('request-promise');
function getComic_truyentranhtuan(link,start,end){
    var arr = [];
    for(var i = start; i <= end; i++) {
        arr.push(link+i);
    }
    let promises = [];
    //request(link, function (html) {
    //    var pat1 = /(\[\")(.*)(\"\])/g;
    //    chapter.push(html.match(pat1));
    //})
    arr.map(function (val) {
        promises.push(requestPromise(val));
    })
    var pat = /(\[\")(.*)(\"\])/g;
    let chapter = []

    promise.all(promises)
        .then(function (htmls) {
            //var res = []
       htmls.map(function (html,temp) {

           //console.log(start+'--'+i);
           html = html.match(pat);
           html = html[0];
           //console.log(html);
           fs.exists(__dirname + '/img/'+  (link + (start+temp)).split("/").pop(),function(exists){
               if(!exists) {
                   fs.mkdir(__dirname + '/img/' + (link + (start + temp)).split("/").pop(), function (err) {
                       test(html,__dirname + '/img/' + (link + (start + temp)).split("/").pop());
                       console.log(__dirname + '/img/' + (link + (start +temp)).split("/").pop()+" created!");
                   });
               }else{
                   test(html,__dirname + '/img/' + (link + (start + temp)).split("/").pop());
               }
           })
       });

    })
}
function test(arr,folder){
    let test = arr.replace(/[\[\]]/g,"").split(",");
    fs.exists(folder,function(exists){
        if(exists){
            for(var i =0 ; i<test.length; i ++){
                console.time('download');
                request.get(test[i].replace(/\"/g,""))
                    .on('error', function(err) {
                        console.log('Download error', err);
                    })
                    .pipe(fs.createWriteStream(folder + '/'+url.parse(test[i]).pathname.replace(/\%22/g,"").split("/").pop())
                        .on('finish', function(){
                            console.timeEnd('download');
                            console.log('Done write to file');
                        }).on('error', function(err){
                            console.log('Error write to file: ', err);
                        })
                );
            }
        }
    })
}
getComic_truyentranhtuan("http://truyentranhtuan.com/one-piece-chuong-",675,725);

