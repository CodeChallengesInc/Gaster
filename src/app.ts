import { Request, Response } from 'express';
import { GameService } from './services/gameService';

const express = require('express');
const app = express();

const board = require('./controllers/board');
const gameTypes = require('./controllers/gameTypes');
const game = require('./controllers/game');
const gameStatus = require('./controllers/gameStatus');
const simulation = require('./controllers/simulation');

const port = 3000;

app.use((req: Request, res: Response, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  next();
});

app.use('/board', board);
app.use('/game', game);
app.use('/gameTypes', gameTypes);
app.use('/gameStatus', gameStatus);
app.use('/test', simulation);

const server = app.listen(port, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('CCI backend listening at http://%s:%s', host, port);
});

const gameService = GameService.getInstance();
gameService.initializeSocketServer(server);
