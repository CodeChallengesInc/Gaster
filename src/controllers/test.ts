import { Request, Response } from 'express';
import { GameService } from '../services/game';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var gameService = GameService.getInstance();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', (req: Request, res: Response) => {
  if (req.body?.code) {
    const gameId = gameService.createTestGame(req.body?.code);
    res.end(gameId);
  }
  res.end('error' + JSON.stringify(req.params) + JSON.stringify(req.body));
});

module.exports = router;
