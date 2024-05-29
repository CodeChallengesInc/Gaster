import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

const express = require('express');
const router = express.Router();
const gameService = GameService.getInstance();

router.get('/', (req: Request, res: Response) => {
  const gameTypes = gameService.getGameTypes();
  if (!gameTypes) {
    res.status(404);
  }
  res.end(JSON.stringify(gameTypes));
});

module.exports = router;
