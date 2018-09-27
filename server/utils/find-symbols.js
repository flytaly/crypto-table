const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const { dbCurrenciesPath } = require('../config');

const adapter = new FileAsync(dbCurrenciesPath);

/**
 * Find currencies with different symbol naming compared to naming in DB file
 * @param {set|array} symbols
 */
async function findSymbols(symbols) {
    const db = await low(adapter);
    symbols.forEach((symbol) => {
        const cur = db.get('currencies').find({ symbol }).value();
        if (!cur) console.error(`Couldn't find symbol: ${symbol}`);
    });
}

module.exports = findSymbols;
