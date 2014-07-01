/**
 * Module dependencies.
 */

var express = require('express')
    , user = require('./routes/user')
    , notes = require('./routes/notes')
    , http = require('http')
    , path = require('path')
    , db   = require('./models');


var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser());
    express.session({secret: '1234567890QWERTY'})
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.locals({
    awsBucket: "TrailSitesProto"
});

//app.use(function(req, res, next) {
//
//    return next();
//});

//app.get('/', routes.index);
//app.post('/notes/new', routes.newNote);
//app.options('/resource_downloader', function(req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//    res.header("Access-Control-Allow-Headers", "ACCEPT, WT_AUTH_TOKEN, CONTENT-TYPE");
//    res.send("", 200);
//});


function requireAuthentication() {

}

app.all("/notes/*", requireAuthentication)

app.get('/notes', notes.new);
app.post('/user/sign_in', user.signIn);

app.configure('development', function(){
  app.use(express.errorHandler());
});

db
    .sequelize
    .sync({ force: true })
    .complete(function(err) {
        if (err) {
            throw err[0]
        } else {
            http.createServer(app).listen(app.get('port'), function(){
                console.log('Express server listening on port ' + app.get('port'))
            })
        }
    })