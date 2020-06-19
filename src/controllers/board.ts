import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

var express = require('express');
var router = express.Router();
var game = GameService.getInstance();

router.get('/:gameId', (req: Request, res: Response) => {
  const board = game.getGameState(req.params.gameId);
  if (!board) {
    res.status(404);
  }
  res.end(JSON.stringify(board));
});

module.exports = router;
