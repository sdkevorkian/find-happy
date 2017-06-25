require('dotenv').config();
var express = require('express');
var rowdy = require('rowdy-logger');
var path = require("path");
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('./config/passport-config');
var methodOverride = require('method-override');
var isLoggedIn = require('./middleware/isLoggedIn');

var app = express();

rowdy.begin(app);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('morgan')('dev'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    // this middleware will call for each requested
    // and we checked for the requested query properties
    // if _method was existed
    // then we know, clients need to call DELETE request instead
    // from http://stackoverflow.com/questions/34926876/override-method-get-to-delete-in-nodejs-using-anchor-tag
    if (req.query._method == 'DELETE') {
        // change the original METHOD
        // into DELETE method
        req.method = 'DELETE';
        // and set requested url to /user/12
        req.url = req.path;
    }
    next();
});

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
    res.render('landing');
});

// controllers
app.use('/addresses', isLoggedIn, require('./controllers/addresses'));
app.use('/favorites', isLoggedIn, require('./controllers/favorites'));
app.use('/demo', require('./controllers/demo'));
app.use('/auth', require('./controllers/auth'));


app.listen(process.env.PORT || 3001, function() {
    rowdy.print();
});
