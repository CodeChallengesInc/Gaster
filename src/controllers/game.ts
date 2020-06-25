import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

var express = require('express');
var router = express.Router();
var gameService = GameService.getInstance();
export const GAME_TYPE = +(process.env.GAME_TYPE || 0);

router.post('/', (req: Request, res: Response) => {
  const gameId = gameService.createGame(GAME_TYPE);
  res.end(gameId);
});

router.delete('/:gameId', (req: Request, res: Response) => {
  gameService.deleteGame(req.params.gameId);
  res.end();
});

module.exports = router;
