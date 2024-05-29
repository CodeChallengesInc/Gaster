import { Request, Response } from 'express';
import { GameService } from '../services/gameService';
import { GameType } from '../models/game-type';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const gameService = GameService.getInstance();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', (req: Request, res: Response) => {
  if (req.body?.gameType && req.body?.code && req.body?.name) {
    const gameId = gameService.createTestGame((<any>GameType)[req.body.gameType], req.body.name, req.body.code);
    res.end(gameId);
  }
  res.end();
});

module.exports = router;
