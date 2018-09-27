const axios = require('axios');

/**
 * Get list of cryptocurrencies from https://coinmarketcap.com
 * @returns Array
 */

// eslint-disable-next-line no-unused-vars
async function getCurrenciesList() {
    const apiUrl = 'https://api.coinmarketcap.com/v2/listings';

    const resp = await axios(apiUrl);
    const data = await resp.data;
    const list = data.data;

    return list;
}


/**
 * Get list of cryptocurrencies from https://cryptocompare.com
 * @returns Object with symbols as keys: {BTC: {...}, ETH: {...},...}
 */
async function getCurrencies() {
    const requiredFields = ['Id', 'ImageUrl', 'Symbol', 'CoinName', 'SortOrder'];
    const mapFieldNames = {
        Id: 'id', ImageUrl: 'imageUrl', Symbol: 'symbol', CoinName: 'name', SortOrder: 'sortOrder',
    };

    const apiUrl = 'https://min-api.cryptocompare.com/data/all/coinlist';
    const resp = await axios(apiUrl);
    const data = await resp.data;
    const currencies = data.Data;

    // remove unnecessary fields and not trading currencies
    const filtered = Object.keys(currencies).reduce((acc, current) => {
        if (currencies[current].IsTrading) {
            acc[current] = {};
            requiredFields.forEach((field) => {
                acc[current][mapFieldNames[field]] = currencies[current][field];
            });
        }
        return acc;
    }, {});

    return filtered;
}

module.exports = getCurrencies;
