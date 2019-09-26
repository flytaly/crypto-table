const cc = require('cryptocompare');

// Map params request to cryptocompare API
module.exports = async (req, res) => {
    const { fsym, tsym } = req.query;
    const date = new Date(Number(req.query.date));
    const historicalData = await cc.priceHistorical(fsym, tsym, date);
    res.send(historicalData);
};
