var express = require('express');
var app = express();

var config = require('./controllers/config');
var board = require('./controllers/board');

const port = 3000;


app.use('/config', config);
app.use('/board', board);

const server = app.listen(port, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });