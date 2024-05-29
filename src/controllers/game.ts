import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

const express = require('express');
const router = express.Router();
const gameService = GameService.getInstance();
export const GAME_TYPE = +(process.env.GAME_TYPE || 0);

router.post('/', (req: Request, res: Response) => {
  console.log('Create Game Requested');
  const gameId = gameService.createGame(GAME_TYPE);
  res.end(gameId);
});

router.delete('/:gameId', (req: Request, res: Response) => {
  gameService.deleteGame(req.params.gameId);
  res.end();
});

module.exports = router;
