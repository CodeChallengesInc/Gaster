import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

const express = require('express');
const router = express.Router();
const game = GameService.getInstance();

router.get('/:gameId', (req: Request, res: Response) => {
  const board = game.getGameBoard(req.params.gameId);
  if (!board) {
    res.status(404);
  }
  res.end(JSON.stringify(board));
});

module.exports = router;
