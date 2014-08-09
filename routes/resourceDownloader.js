var AWS = require('aws-sdk');
var db = require('../models')
AWS.config.update({accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET});
awsBucket = new AWS.S3({params: {Bucket: 'FlashArchives'}});

var request = require('request');
var url = require('url');

function absoluteAwsUrl(path) {
    var encodedPath = path.split("/").map(function(sect){ return encodeURIComponent(sect) }).join("/");
    return "https://s3.amazonaws.com/FlashArchives/" + encodedPath
}

function generateArchivePath(path, revisionNumber) {
    return path[path.length-1] == "/" ? path + revisionNumber : path + "/" + revisionNumber;
}

exports.download = function(req, res){
    console.log("in the resource downloader");

    db.Note.find({ where: { id: req.body.noteId }}).then(function(note) {
        if (note) {
            if (note.UserId == req.user.id) {
                // this is a request from the extension, which generates the aws url client side
                var archivePath = req.body.html.awsPath
                var archiveUrl = absoluteAwsUrl(archivePath)
                var resp = { archiveUrl: archiveUrl};

                new ResourceHandler(req, archivePath, archiveUrl, note);

                res.send(resp, 200);
            } else {
                res.json({ errors: [{ message:'not authorized for that operation' }] }, 401);
            }
        } else {
            res.json({ errors: [{ message:'note not found' }] }, 404)
        }
    })
    res.send(200);
};

ResourceHandler = function(req, archivePath, archiveUrl, note) {
    var resources = req.body.originalToAwsUrlMap || [];
    var stylesheets= req.body.processedStylesheets || [];
    var html = req.body.html;
    var isIframe = req.body.isIframe;
    var site = {
        savedResources: [],
        savedStylesheets: [],
        archiveUrl: archiveUrl
    }

    var callbackTracker = new CallbackTracker(Object.keys(resources).length, Object.keys(stylesheets).length, function() {
        console.log("is iframe?", isIframe, typeof isIframe);
        if (isIframe == "false") {
            console.log("archive location is: " + site.archiveUrl);
            console.log("now updating the site");
        }

        console.log("saved to ", site.archiveUrl);
        note.updateAttributes({archiveUrl: site.archiveUrl}).then(function(note) {
            console.log("note archive url saved")
        })
    });

    console.log('in the resource handler');

    function mirrorResource(resourceUrl, mirrorPath) {
        var requestOptions = {
            uri: resourceUrl,
            encoding: null
        }
        request(requestOptions, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                putDataOns3(mirrorPath, body, response.headers["content-type"], function() {
                    site.savedResources.push(resourceUrl);
                    callbackTracker.markResourceAsSaved(resourceUrl);
                });
            } else {
                console.log("error downloading from: " + resourceUrl);
                if (error) console.log("error is: " + error.message);
//                console.log("status code is: " + response.statusCode);
                callbackTracker.markResourceAsSaved();
            }
        })
    }

    function putDataOns3(path, data, contentType, callback) {
        var params = {Key: path, Body: data, ACL: "public-read", CacheControl: "max-age=157680000, public" };
        if (contentType) {
            params["ContentType"] = contentType;
        }
        awsBucket.putObject(params, function(err, data) {
            if (err) {
                console.log("Error uploading data for path: "  + path + ", err: " + err);
            } else {
                console.log("Successfully uploaded to: " + absoluteAwsUrl(path));
            }
            callback(data);
        })
    }

    for ( var path in stylesheets ) {
        if (site.savedStylesheets.indexOf(path) == -1) {
            putDataOns3(path, stylesheets[path], "text/css", function(path) {
                return function() {
                    site.savedStylesheets.push(path);
                    callbackTracker.markStylesheetAsSaved();
                }
            }(path));
        } else {
            console.log("stylesheet already saved, skipping");
            callbackTracker.markStylesheetAsSaved();
        }
    }

    for ( var resourceUrl in resources ) {
        if (site.savedResources.indexOf(resourceUrl) == -1) {
            mirrorResource(resourceUrl, resources[resourceUrl]);
        } else {
            console.log("resource already saved, skipping");
            callbackTracker.markResourceAsSaved();
        }
    }

    console.log("archive location is: " + site.archiveUrl);

    callbackTracker.setSaveHtmlFunction(function(callback) {
        putDataOns3(archivePath, html.html, "text/html", function() {
            callback();
        });
    })
}


// Waits for all resources to be downloaded before saving the full html and
// calling the given callback.
CallbackTracker = function(resourcesRemaining, stylesheetsRemaining, callback) {
    var htmlSaveFunction = false;

    this.markResourceAsSaved = function() {
        resourcesRemaining -= 1;
        checkIfMirroringIsComplete();
    };

    this.markStylesheetAsSaved = function() {
        stylesheetsRemaining -= 1;
        checkIfMirroringIsComplete();
    };

    this.setSaveHtmlFunction = function(fn) {
        htmlSaveFunction = fn;
        checkIfMirroringIsComplete();
    };

    function checkIfMirroringIsComplete() {
        console.log("stylesheets remaining is:" + stylesheetsRemaining);
        console.log("resources remaining is:" + resourcesRemaining);
        if (stylesheetsRemaining <= 0 && resourcesRemaining <= 0 && htmlSaveFunction) {
            console.log("mirroring complete");
            htmlSaveFunction(callback);
        }
    }
};