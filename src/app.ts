import { Request, Response } from 'express';

const express = require('express');
const app = express();

var board = require('./controllers/board');
var gameTypes = require('./controllers/gameTypes');
var game = require('./controllers/game');
var test = require('./controllers/test');
var gameStatus = require('./controllers/gameStatus');

const port = 3000;

app.use((req: Request, res: Response, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  next();
});

app.use('/board', board);
app.use('/game', game);
app.use('/gameTypes', gameTypes);
app.use('/test', test);
app.use('/gameStatus', gameStatus);

const server = app.listen(port, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('CCI backend listening at http://%s:%s', host, port);
});
