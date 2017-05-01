var express = require('express');
var rowdy = require('rowdy-logger');

var app = express();

rowdy.begin(app);


app.use(require('morgan')('dev'));


app.get('/', function(req, res) {
    res.send("welcome");
});



app.listen(3000, function() {
    rowdy.print();
});
