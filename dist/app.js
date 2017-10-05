'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/config');
var autoIncrement = require('mongoose-auto-increment');

var index = require('./routes/v1/index');
var users = require('./routes/v1/users');
var auth = require('./routes/v1/auth');

var app = express();

var options = {
    promiseLibrary: require('bluebird'),
    useMongoClient: true
};

mongoose.Promise = global.Promise;
mongoose.connect(config.db.url, options).then(function () {
    console.log('database connected');
}).catch(function (err) {
    console.error("cannot establish connection with database : " + err);
});

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/1', index);
app.use('/1/auth', auth);
app.use('/1/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
//# sourceMappingURL=app.js.map