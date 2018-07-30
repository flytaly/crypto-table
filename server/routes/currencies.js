const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const { dbCurrenciesPath } = require('../config');

const adapter = new FileAsync(dbCurrenciesPath);

module.exports = async (req, res) => {
    const db = await low(adapter);
    const currencies = db.get('currencies').value();

    res.send(currencies);
};
