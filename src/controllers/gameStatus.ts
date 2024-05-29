import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

const express = require('express');
const router = express.Router();
const gameService = GameService.getInstance();

router.get('/:gameId', (req: Request, res: Response) => {
  const gameStatus = gameService.getGameStatus(req.params.gameId);
  if (!gameStatus) {
    res.status(404);
  }
  res.end(JSON.stringify(gameStatus));
});

module.exports = router;
