var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
// setting the view engine
app.set('view engine', 'ejs');

// setting the view path
app.set('views', path.join(__dirname, 'views'));

app.use(session({ secret: 'keyboard cat' }));
// make bower_components act as a root folder
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(express.static(path.join(__dirname, 'assets')));

var request = require('request');

//routes
app.use(require('./routes'));


// set the port
var port = process.env.PORT || 1337;

// listen on that port
app.listen(port, function()
{
    console.log('ready on port!');

});