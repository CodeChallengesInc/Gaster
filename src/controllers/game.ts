import { Request, Response } from 'express';
import { GameService } from '../services/gameService';
import { GameType } from '../models/gameType';

var express = require('express');
var router = express.Router();
var gameService = GameService.getInstance();

router.post('/', (req: Request, res: Response) => {
  const gameId = gameService.createGame(GameType.LoneAnt);
  res.end(gameId);
});

router.delete('/:gameId', (req: Request, res: Response) => {
  gameService.deleteGame(req.params.gameId);
  res.end();
});

module.exports = router;
