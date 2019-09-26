const router = require('express').Router();
const exchanges = require('./exchanges');
const currencies = require('./currencies');
const historical = require('./historical');

router.get('/api/exchanges', exchanges);
router.get('/api/currencies', currencies);
router.get('/api/historical', historical);

module.exports = router;
