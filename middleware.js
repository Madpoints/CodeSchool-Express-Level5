var express = require('express');
var app = express();

var logger = require('./logger');
app.use(logger);

// Load html page using express
// app.get('/', function(request, response) {
//   response.sendFile(__dirname + '/public/index.html') ;
// });

// .use will serve files from folder without using dirname etc.
// defaults to serve index.html
app.use(express.static('public'));

// Extracting routes to modules
var blocks = require('./routes/blocks');
app.use('/blocks', blocks);

app.listen(process.env.PORT, function() {
    console.log(process.env.PORT);
});
