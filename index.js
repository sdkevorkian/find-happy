require('dotenv').config();
var express = require('express');
var rowdy = require('rowdy-logger');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('./config/passport-config');
var isLoggedIn = require('./middleware/isLoggedIn');
// may make separate controller for map page and use above middleware

var app = express();

rowdy.begin(app);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('morgan')('dev'));
app.use(ejsLayouts);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveuninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

// routes!
app.get('/', function(req, res) {
    res.send("welcome");
});

// controllers
app.use('/auth', require('./controllers/auth'));

app.listen(3000, function() {
    rowdy.print();
});
