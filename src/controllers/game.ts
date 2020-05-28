import { Request, Response } from "express";
import { GameService } from '../services/game';

var express = require('express');
var router = express.Router();
var gameService = GameService.getInstance();

router.post('/', (req: Request, res: Response) => {
    const gameId = gameService.createGame();
    res.end(gameId);
});

router.delete('/:gameId', (req: Request, res: Response) => {
    gameService.deleteGame(req.params.gameId);
    res.end();
});

module.exports = router;