const axios = require('axios');
const formatCurrencies = require('./binance-currencies');

// const findSymbols = require('../../../utils/find-symbols')

const baseURL = 'https://api.binance.com';

module.exports = () => {
    let info;

    async function getInfo() {
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#exchange-information
        const { data: exchangeInfo } = await axios(`${baseURL}/api/v1/exchangeInfo`);

        const trading = exchangeInfo.symbols.filter(s => s.status === 'TRADING');
        const baseAssets = new Set(trading.map(s => s.baseAsset));
        const quoteAssets = new Set(trading.map(s => s.quoteAsset));
        const symbols = exchangeInfo.symbols.reduce((acc, pair) => {
            acc[pair.symbol] = pair;
            return acc;
        }, {});
        return { symbols, baseAssets, quoteAssets };
    }

    /**
     * Format ticker from {baseAsset1quoteAsset1: {price: xxx}, ...}
     * to [baseAsset1 : { quoteAsset1 : {last_price: xxx}, quoteAsset2 : {...}...}, ...]
     */
    const formatTicker = (ticker, symbolsInfo) =>
        ticker.reduce((acc, pair) => {
            const { symbol, price } = pair;
            const pairTicker = { last_price: price };
            const pairInfo = symbolsInfo.symbols[symbol];

            if (pairInfo) {
                let { baseAsset, quoteAsset } = pairInfo;

                // Replace symbols to their naming in database file
                baseAsset = formatCurrencies[baseAsset] ? formatCurrencies[baseAsset] : baseAsset;
                quoteAsset = formatCurrencies[quoteAsset] ? formatCurrencies[quoteAsset] : quoteAsset;

                if (acc[baseAsset]) {
                    acc[baseAsset][quoteAsset] = pairTicker;
                } else {
                    acc[baseAsset] = { [quoteAsset]: pairTicker };
                }
            } else {
                console.error('-->', `Couldn't find pair ${symbol}`);
            }

            return acc;
        }, {});


    async function getTicker() {
        try {
            if (!info) {
                info = await getInfo();
            }

            // await findSymbols(info.baseAssets);

            const { data: prices } = await axios(`${baseURL}/api/v3/ticker/price`);

            return formatTicker(prices, info);
        } catch (e) {
            // console.error('Binance error: ', e.message);
            return { error: e };
        }
    }

    return getTicker;
};
