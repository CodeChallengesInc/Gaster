import { Request, Response } from 'express';
import { GameService } from '../services/gameService';
import { GameType } from '../models/gameType';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var gameService = GameService.getInstance();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', (req: Request, res: Response) => {
  if (req.body?.code && req.body?.antName) {
    const gameId = gameService.createTestGame(GameType.LoneAnt, req.body.antName, req.body.code);
    res.end(gameId);
  }
  res.end();
});

module.exports = router;
