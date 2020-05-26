var express = require('express');
var router = express.Router();
var Configuration = require('../models/config');

const config = new Configuration();

router.get('/', function(req, res) {
    res.end(JSON.stringify(config));
});

module.exports = router;