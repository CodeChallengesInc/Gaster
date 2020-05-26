var express = require('express');
var router = express.Router();
var Board = require('../models/board');

const board = new Board();

router.get('/', function(req, res) {
    res.end(JSON.stringify(board));
});

module.exports = router;