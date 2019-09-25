const cc = require('cryptocompare');

const platformName = 'cryptocompare';

const makeQuoteAssetsSymbols = (quoteAssets) => quoteAssets.reduce((acc, curr) => {
    const { exchange, quoteAsset } = curr;
    if (exchange === platformName && !acc.includes(quoteAsset)) { acc.push(quoteAsset); }
    return acc;
}, []);


/**
 * Format ticker from {baseAsset1: {quoteAsset1: price, ...}
* to [baseAsset1 : { quoteAsset1 : {last_price: price}, quoteAsset2 : {...}...}, ...]
*/
const formatTicker = (ticker) => {
    const formated = {};
    Object.keys(ticker).forEach((base) => {
        const quoteAssets = {};
        Object.keys(ticker[base]).forEach((quote) => {
            quoteAssets[quote] = { last_price: ticker[base][quote] };
        });
        formated[base] = quoteAssets;
    });
    return formated;
};

const getTicker = async ({ baseAssets = [], quoteAssets = [] } = {}) => {
    const quoteAssetsSymbols = makeQuoteAssetsSymbols(quoteAssets);
    const prices = await cc.priceMulti(baseAssets, quoteAssetsSymbols);
    return formatTicker(prices);
};

module.exports = () => getTicker;
