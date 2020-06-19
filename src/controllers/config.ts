import { Request, Response } from 'express';
import { TICKS_PER_SECOND, MAX_TICKS } from '../services/gameService';

var express = require('express');
var router = express.Router();

const config = {
  ticksPerSecond: TICKS_PER_SECOND,
  maxTicks: MAX_TICKS
};

router.get('/', (req: Request, res: Response) => {
  res.end(JSON.stringify(config));
});

module.exports = router;
