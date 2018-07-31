const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const { dbCurrenciesPath } = require('../config');

const adapter = new FileAsync(dbCurrenciesPath);

/**
 * Find currencies with different symbol naming compare to coinmarketcap naming
 * @param {set|array} symbols
 */
module.exports = async function findSymbols(symbols) {
    const db = await low(adapter);
    symbols.forEach((symbol) => {
        const cur = db.get('currencies').find({ symbol }).value();
        if (!cur) console.log(`Couldn't find symbol: ${symbol}`);
    });
}
