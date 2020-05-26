var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
    res.end('This will create a new game someday');
});

router.delete('/:gameId', function(req, res) {
    res.end(`This will delete game ${req.params.gameId} someday`);
})

module.exports = router;