const path = require('path');

const config = {
    port: 5000,
    host: 'http://localhost',
    dbPath: path.join(__dirname, '../../db.json'),
    dbDefaultPath: path.join(__dirname, '../../db.default.json'),
    dbCurrenciesPath: path.join(__dirname, '../../currencies.json'),
    updateInterval: 2000,
};

module.exports = config;
