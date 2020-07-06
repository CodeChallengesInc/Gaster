import { Request, Response } from 'express';
import { GameService } from '../services/gameService';
import { GameType } from '../models/game-type';

interface Object {
  [idx: string]: any;
}

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var gameService = GameService.getInstance();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', (req: Request, res: Response) => {
  if (req.body?.gameType && req.body?.code && req.body?.animalName) {
    const gameId = gameService.createTestGame((<any>GameType)[req.body.gameType], req.body.animalName, req.body.code);
    res.end(gameId);
  }
  res.end();
});

module.exports = router;
