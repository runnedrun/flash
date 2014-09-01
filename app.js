/**
 * Module dependencies.
 */

var express = require('express')
    , user = require('./routes/user')
    , notes = require('./routes/notes')
    , resourceDownloader = require('./routes/resourceDownloader')
    , flash = require('./routes/flash')
    , http = require('http')
    , path = require('path')
    , RedisStore = require('connect-redis')(express)
    , db   = require('./models')
    , ultraRepl = require('ultra-repl')
    , replify = require('replify');


var app = express();

app.configure(function(){
    var session = express.session({secret: '1234567890QWERTY', store: new RedisStore({
        host:'127.0.0.1',
        port:6379,
        prefix:'sess'
    })});

//    var session = express.session({secret: '1234567890QWERTY'});

    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.disable('view cache');
    app.use(express.cookieParser());
    app.use(session);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(requireAuthentication);
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

//app.get('/', routes.index);
//app.post('/notes/new', routes.newNote);
//app.options('/resource_downloader', function(req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//    res.header("Access-Control-Allow-Headers", "ACCEPT, WT_AUTH_TOKEN, CONTENT-TYPE");
//    res.send("", 200);
//});



var authWhitelistPrefixes = ["/user/sign", "/js", "/stylesheets"];
function requiresAuth(url) {
    console.log("checking auth")
    for(var i = 0; i < authWhitelistPrefixes.length; i++) {
        if(!!url.match(new RegExp("^" + authWhitelistPrefixes[i]))) {
            return false
            console.log(url +"does not require auth")
        }
    }
    console.log(url +" requires auth")
    return true
}

function renderAuthError(req, res){
    if (req.get('Accept') == "application/json") {
        res.json({err: "you must be logged in to do that"}, 401);
    } else {
        res.redirect("/user/sign_in");
    }
}

function requireAuthentication(req, res, next) {
    if (requiresAuth(req.url)) {
        console.log("auth required");
        var username = req.session && req.session.username;

        console.log("username is " + username)
        if (username) {
             db.User.find({where: {username: username}}).then(function(user) {
                debugger;
                if (user) {
                    req.user = user;
                    next();
                } else {
                    renderAuthError(req, res);
                }
            })
        } else {
            renderAuthError(req, res);
        }
    } else {
        next()
    }
}

app.get('/', flash.index);
app.get('/notes', notes.index);
app.post('/note', notes.new);
app.post('/note/delete', notes.delete);
app.post('/note/update', notes.update);
app.post('/user/sign_in', user.signInAction);
app.post('/user/sign_up', user.signUpAction);
app.get('/user', user.show);
app.post('/resource_downloader', resourceDownloader.download);

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'))
})

var errorHandler = express.errorHandler;

errorHandler({
   handlers: {
       "500": function (e) { console.log("error", e) }
    },
    server: server
})

app.configure('development', function(){
    process.on('uncaughtException', function(err) {
        // handle the error safely
        console.log(err);
    });

    app.use(errorHandler);
    replify({ name: 'flash' }, app, { db: db });
});
