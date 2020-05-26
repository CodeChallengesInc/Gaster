var express = require('express');
var GameService = require('../services/game');
var router = express.Router();
var gameService = GameService.getInstance();

router.post('/', function(req, res) {
    const gameId = gameService.createGame();
    res.end(gameId);
});

router.delete('/:gameId', function(req, res) {
    gameService.deleteGame(req.params.gameId);
    res.end();
});

module.exports = router;