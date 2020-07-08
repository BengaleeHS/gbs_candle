'use strict';
var express = require('express');
var app = express();
var mainrouter = require('./router/main')(app);
var apirouter = require('./router/api')(app);
var request = require('request');
var bodyparser = require('body-parser')
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var cookieParser = require('cookie-parser');
app.set("view engine", "pug");
app.set('views', './views');

app.use(express.static('./public'));


app.use(session({
    secret: 'what the gbs',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
    //expires: new Date(Date.now() + (3*86400 * 1000))
}));
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/', mainrouter);
app.use('/api', apirouter);

var server = app.listen(1337, () => {
    console.log("Server is running");
});





