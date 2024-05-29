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
  console.log('Create Game Requested');
  if (req.body?.gameType) {
    const gameId = gameService.createGame((<any>GameType)[req.body.gameType]);
    res.end(gameId);
  } else {
    console.log('Could not create game, Game Type not passed in!');
  }
});

router.delete('/:gameId', (req: Request, res: Response) => {
  gameService.deleteGame(req.params.gameId);
  res.end();
});

module.exports = router;
