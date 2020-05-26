var express = require('express');
var router = express.Router();

router.get('/:gameId', function(req, res) {
    res.end(`This will fetch gameId ${req.params.gameId} someday`)
});

module.exports = router;