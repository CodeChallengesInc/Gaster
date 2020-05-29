import { Request, Response } from 'express';
import { TICKS_PER_SECOND } from '../services/game';

var express = require('express');
var router = express.Router();

const config = { ticksPerSecond: TICKS_PER_SECOND };

router.get('/', (req: Request, res: Response) => {
  res.end(JSON.stringify(config));
});

module.exports = router;
