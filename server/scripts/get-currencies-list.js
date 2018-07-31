const axios = require('axios');

/**
 * Get list of cryptocurrencies from https://coinmarketcap.com
 */
async function getCurrenciesList() {
    const apiUrl = 'https://api.coinmarketcap.com/v2/listings';

    const resp = await axios(apiUrl);
    const data = await resp.data;
    const list = data.data;

    return list;
}

module.exports = getCurrenciesList;
