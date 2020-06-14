import { Request, Response } from 'express';

var express = require('express');
var app = express();

var config = require('./controllers/config');
var board = require('./controllers/board');
var game = require('./controllers/game');
var test = require('./controllers/test');
var gameStatus = require('./controllers/gameStatus');

const port = 3000;

app.use((req: Request, res: Response, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  next();
});

app.use('/config', config);
app.use('/board', board);
app.use('/game', game);
app.use('/test', test);
app.use('/gameStatus', gameStatus);

const server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('CCI backend listening at http://%s:%s', host, port);
});
