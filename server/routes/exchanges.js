const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const cc = require('cryptocompare');
const { dbPath } = require('../config');

const adapter = new FileAsync(dbPath);

const CC_FIAT = [
    'USD', 'EUR',
];

module.exports = async (req, res) => {
    const db = await low(adapter);
    const exchanges = db.get('exchanges').value();

    const ccResponse = await cc.coinList();
    if (ccResponse.Response === 'Success') {
        const { Data } = ccResponse;
        if (!Data) return;
        exchanges.push({
            name: 'CryptoCompare',
            id: 'cryptocompare',
            url: 'https://cryptocompare.com',
            quoteAssets: [...CC_FIAT, ...Object.keys(Data)],
        });
    }

    res.send(exchanges);
};
