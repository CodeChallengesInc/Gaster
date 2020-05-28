import { Request, Response } from 'express';

var express = require('express');
var router = express.Router();

const config = { ticksPerSecond: 1 };

router.get('/', (req: Request, res: Response) => {
  res.end(JSON.stringify(config));
});

module.exports = router;
