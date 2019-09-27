const cc = require('cryptocompare');
const moment = require('moment');

const stepsDefault = 10;

module.exports = async (req, res) => {
    const { fsym, tsym, steps = stepsDefault } = req.query;

    const startDate = req.query.startDate
        ? new Date(Number(req.query.startDate))
        : moment().subtract(1, 'years').toDate();

    const endDate = req.query.endDate
        ? new Date(Number(req.query.endDate))
        : new Date();

    const stepRange = (endDate - startDate) / steps;

    const pricePromises = Array.from({ length: steps },
        async (_, i) => {
            const date = new Date(endDate.getTime() - i * stepRange);
            const result = await cc.priceHistorical(fsym, tsym, date);
            return { ...result, time: date.getTime() };
        });

    const results = await Promise.all(pricePromises);

    res.send(results);
};
