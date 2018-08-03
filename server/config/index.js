const path = require('path');

let config = {
    port: 5000,
    host: 'http://localhost',
    dbPath: path.join(__dirname, '../../db.json'),
    dbDefaultPath: path.join(__dirname, '../../db.default.json'),
    dbCurrenciesPath: path.join(__dirname, '../../currencies.json'),
    updateInterval: 2000,
};

// TEST
if (process.env.NODE_ENV === 'test') {
    config = {
        ...config,
        port: 5555,
        dbPath: path.join(__dirname, '../../db.test.json'),
        updateInterval: 50,
    };
}

module.exports = config;

