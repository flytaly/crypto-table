const router = require('express').Router();
const exchanges = require('./exchanges');
const currencies = require('./currencies');

router.get('/api/exchanges', exchanges);
router.get('/api/currencies', currencies);

module.exports = router;
