import { Request, Response } from "express";

var express = require('express');
var router = express.Router();
var Configuration = require('../models/config');

const config = new Configuration();

router.get('/', (req: Request, res: Response) => {
    res.end(JSON.stringify(config));
});

module.exports = router;