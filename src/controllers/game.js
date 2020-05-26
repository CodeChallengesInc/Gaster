var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
    res.end();
});

router.delete('/', function(req, res) {
    res.end();
})

module.exports = router;