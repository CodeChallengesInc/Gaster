import { Request, Response } from 'express';
import { GameService } from '../services/game';

var express = require('express');
var router = express.Router();
var gameService = GameService.getInstance();

router.get('/:gameId', (req: Request, res: Response) => {
  const board = gameService.getBoard(req.params.gameId);
  if (!board) {
    res.status(404);
  }
  res.end(JSON.stringify(board));
});

module.exports = router;
