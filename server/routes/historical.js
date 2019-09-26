const cc = require('cryptocompare');
const moment = require('moment');

const stepsDefault = 10;
const timeUnits = {
    months: 'months',
};

module.exports = async (req, res) => {
    const { fsym, tsym, steps = stepsDefault, timeUnit = timeUnits.months } = req.query;

    const pricePromises = Array.from({ length: steps },
        async (_, i) => {
            const date = moment()
                .subtract(i, timeUnit)
                .toDate();
            const result = await cc.priceHistorical(fsym, tsym, date);
            return { ...result, time: date.getTime() };
        });

    const results = await Promise.all(pricePromises);

    res.send(results);
};
