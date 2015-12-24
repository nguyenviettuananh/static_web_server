//'use strict';
//const request = require('request');
//const url = require('url');
//const fs = require('fs');
//let promise = require('bluebird');
//const cheerio = require('cheerio');
//let requestPromise = require('request-promise');
//var mkdirAsycn = promise.promisify(fs.mkdir);
//var link = "http://thethao.vnexpress.net/tin-tuc/bong-da/";
//var pat = /#box_comment/g;
//var arr = [] ;
//let promises = [];
//request(link,function(err,repsonse,html){
//    var $ = cheerio.load(html);
//    //console.log(html);
//    var news  = $(".sub_breakumn li h4 a");
//    for(var i = 0; i < news.length;i++){
//        //console.log( news[i].attribs.title);
//        //console.log(link + news[i].attribs.href.split('/').pop());
//        //mkdirAsycn(__dirname+'/news/'+news[i].attribs.title).then(console.log(__dirname+'/news/'+news[i].attribs.title)+'created');
//        request(link + news[i].attribs.href.split('/').pop(),function(err,response,html){
//            var $ = cheerio.load(html);
//            var list_news = $("#news_home li h2 a");
//            for(var i = 0 ; i<list_news.length; i++){
//                if(!list_news[i].attribs.href.match(pat)){
//                    arr.push(list_news[i].attribs.href);
//                }
//            }
//            arr.map(function(val){
//                promises.push(requestPromise(val));
//            })
//            promise.all(promises).then(function(htmls){
//                htmls.map(function(html,temp){
//                    console.log(temp);
//                })
//            })
//        })
//    }
//})




'use strict';
const promise = require('bluebird');
const gm = require('gm');
const request = require('request');
const cheerio = require('cheerio');
var array = [];
var arr1 = [];
var getAsync = promise.promisify(request.get);
const url = require('url');
const fs = require('fs');
var mmmagic = require('mmmagic');
var magic = new mmmagic.Magic(mmmagic.MAGIC_MIME_TYPE);
//function getPhoto(folder,link,name){
//    return new Promise(function(fullfill,reject){
//        request.get(item).on("error",function(err){
//            reject(err);
//        }).pipe(createWriteStream(folder+name)).on('finish',function(){
//            fullfill(name);
//        }).on('error',function(err){
//            reject(err);
//        })
//    })
//}
getAsync("https://unsplash.com/").then(function(response){
    var $ = cheerio.load(response.body);
    var image = $(".js-grid-image-container .photo__image");
    for(var i = 0 ; i<image.length; i++){
        array.push(image[i].attribs.src);
    }
    return array;
}).then(function(arr){
    arr.map(function(val){
        //console.log(url.parse(val));
        var ext;
        var extension = url.parse(val).query.split('&');
        //console.log(extension);
        promise.map(extension,function (item) {
            if(item.indexOf('fm') > -1){
                ext = (item.split('=').pop());
            }
            return ext;
        })
        //.then(function(item){
        //    console.log(item);
        //});
        //console.log(ext);
        //console.log(ext);
        //fs.exists(__dirname+'/img/'+url.parse(val).pathname+'.'+ext,function(exists){
        //    if(!exists){
        //                console.time('download');
        //                request.get(val)
        //                    .on('error',function(err){
        //                        console.log('Download error', err);
        //                    })
        //                    //.pipe(fs.createWriteStream(__dirname+'/img/'+url.parse(val).pathname)+'.'+ext)
        //                    .on('finish',function() {
        //                        console.timeEnd('download');
        //                        console.log('Done write to file')
        //                    }).on('error',function(err){
        //                        console.log("Error write to file: ",err);
        //                    })
        //        }
        //    })
        fs.exists(__dirname+'/img/'+url.parse(val).pathname+'.'+ext,function(exists){
            if(!exists){
                console.time('download');
                request.get(val)
                    .on('error',function(err){
                        console.log('Download error', err);
                    })
                    .pipe(fs.createWriteStream(__dirname+'/img/'+url.parse(val).pathname))
                    .on('finish',function(){
                        console.timeEnd('download');
                        console.log('Done write to file');
                        fs.readdir(__dirname+'/img/',function(err,files){
                            if(err) console.log(err);
                            promise.map(files,function(val){
                                if(!val.match(/\./g)){
                                    if(val != ".DS_Store"){
                                        var res = val.split('.');
                                        var ext = magic.detectFile(__dirname+'/img/'+val,function(err,res){
                                            if(err) console.log(err);
                                            var extension = res.split('/').pop().replace('e','');
                                            //console.log(extension);
                                            fs.rename(__dirname+'/img/'+val,__dirname+'/img/'+val+'.'+extension,function(err){
                                                if(err) console.log(err);
                                                console.log('renamed !!');
                                                //fs.exists(__dirname+'/thumb/'+val,function(err,exists){
                                                //    if(!exists){
                                                //        if(val != ".DS_Store"){
                                                //            gm(__dirname+'/img/'+val).thumb(200,200,__dirname+'/thumb/'+val,100,function(err){
                                                //                if(err) return console.log(err);
                                                //                console.log("thumbnail created!");
                                                //            })
                                                //        }
                                                //    }
                                                //})
                                                //fs.exists(__dirname+'/BW/'+val,function(err,exists){
                                                //    if(!exists){
                                                //        if(val != ".DS_Store"){
                                                //            gm(__dirname+'/img/'+val).blackThreshold(200,200,200).write(__dirname+'/BW/'+val,function(err){
                                                //                if(err) return console.log(err);
                                                //                console.log("BW created!!");
                                                //            })
                                                //        }
                                                //    }
                                                //})
                                                //fs.readdir(__dirname+'/img/',function(err,files){
                                                //    files.map(function(val){
                                                //        var exists = fs.existsSync(__dirname+'/thumb/'+val+'.'+ext);
                                                //            if(!exists){
                                                //                if(val != ".DS_Store"){
                                                //                    gm(__dirname+'/img/'+val).thumb(200,200,__dirname+'/thumb/'+val,100,function(err){
                                                //                        if(err) return console.log(err);
                                                //                        console.log("thumbnail created!");
                                                //                    })
                                                //                }
                                                //            }
                                                //        //fs.existsSync(__dirname+'/thumb/'+val,function(err,exists){
                                                //        //    if(!exists){
                                                //        //        if(val != ".DS_Store"){
                                                //        //            gm(__dirname+'/img/'+val).thumb(200,200,__dirname+'/thumb/'+val,100,function(err){
                                                //        //                if(err) return console.log(err);
                                                //        //                console.log("thumbnail created!");
                                                //        //            })
                                                //        //        }
                                                //        //    }
                                                //        //})
                                                //        //fs.exists(__dirname+'/BW/'+val,function(err,exists){
                                                //        //    if(!exists){
                                                //        //        if(val != ".DS_Store"){
                                                //        //            gm(__dirname+'/img/'+val).blackThreshold(200,200,200).write(__dirname+'/BW/'+val,function(err){
                                                //        //                if(err) return console.log(err);
                                                //        //                console.log("BW created!!");
                                                //        //            })
                                                //        //        }
                                                //        //    }
                                                //        //})
                                                //    })
                                                //})
                                            })
                                        })
                                        //fs.exists(__dirname+'/thumb/'+val,function(err,exists){
                                        //    if(!exists){
                                        //        if(val != ".DS_Store"){
                                        //            gm(__dirname+'/img/'+val).thumb(200,200,__dirname+'/thumb/'+val,100,function(err){
                                        //                if(err) console.log(err);
                                        //                console.log("thumbnail created!");
                                        //            })
                                        //        }
                                        //    }
                                        //})
                                        //fs.exists(__dirname+'/BW/'+val,function(err,exists){
                                        //    if(!exists){
                                        //        if(val != ".DS_Store"){
                                        //            gm(__dirname+'/img/'+val).blackThreshold(200,200,200).write(__dirname+'/BW/'+val,function(err){
                                        //                if(err) console.log(err);
                                        //                console.log("BW created!!");
                                        //            })
                                        //        }
                                        //    }
                                        //})
                                    }
                                }else{
                                    return
                                }
                            }).then(function(){
                                fs.readdir(__dirname+'/img/',function(err,files){
                                    files.map(function(val){
                                        var exists = fs.existsSync(__dirname+'/thumb/'+val+'.'+ext);
                                        if(!exists){
                                            if(val != ".DS_Store"){
                                                gm(__dirname+'/img/'+val).thumb(200,200,__dirname+'/thumb/'+val,100,function(err){
                                                    //if(err) return console.log(err);
                                                    //console.log("thumbnail created!");
                                                })
                                            }
                                        }
                                        //fs.existsSync(__dirname+'/thumb/'+val,function(err,exists){
                                        //    if(!exists){
                                        //        if(val != ".DS_Store"){
                                        //            gm(__dirname+'/img/'+val).thumb(200,200,__dirname+'/thumb/'+val,100,function(err){
                                        //                if(err) return console.log(err);
                                        //                console.log("thumbnail created!");
                                        //            })
                                        //        }
                                        //    }
                                        //})
                                        fs.exists(__dirname+'/BW/'+val,function(err,exists){
                                            if(!exists){
                                                if(val != ".DS_Store"){
                                                    gm(__dirname+'/img/'+val).blackThreshold(200,200,200).write(__dirname+'/BW/'+val,function(err){
                                                        //if(err) return console.log(err);
                                                        //console.log("BW created!!");
                                                    })
                                                }
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                    .on('error', function (err) {
                        console.log("Error write to file: ",err);
                    })
            }
            else{
                console.log("Image has been downloaded!!");
            }
        })
        //console.log(url.parse(val).pathname);
    })
}).then(function(){
    //fs.readdir(__dirname+'/img/',function(err,files){
    //    files.map(function(val){
    //        //fs.exists(__dirname+'/thumb/'+val,function(err,exists){
    //        //    if(!exists){
    //        //        if(val != ".DS_Store"){
    //        //            gm(__dirname+'/img/'+val).thumb(200,200,__dirname+'/thumb/'+val,100,function(err){
    //        //                if(err) console.log(err);
    //        //                console.log("thumbnail created!");
    //        //            })
    //        //        }
    //        //    }
    //        //})
    //        //fs.exists(__dirname+'/BW/'+val,function(err,exists){
    //        //    if(!exists){
    //        //        if(val != ".DS_Store"){
    //        //            gm(__dirname+'/img/'+val).blackThreshold(200,200,200).write(__dirname+'/BW/'+val,function(err){
    //        //                if(err) console.log(err);
    //        //                console.log("BW created!!");
    //        //            })
    //        //        }
    //        //    }
    //        //})
    //    })
    //})
})


