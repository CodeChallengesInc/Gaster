var express = require('express');
var router = express.Router();
var GameService = require('../services/game');
var gameService = GameService.getInstance();

router.get('/:gameId', function(req, res) {
    const board = gameService.getBoard(req.params.gameId);
    if (!board) {
        res.status(404);
    }
    res.end(JSON.stringify(board));
});

module.exports = router;