const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const getCurrenciesList = require('./get-currencies');

const { dbPath, dbDefaultPath, dbCurrenciesPath } = require('../config');

// eslint-disable-next-line import/no-dynamic-require
const defaults = require(dbDefaultPath);


async function saveList() {
    const list = await getCurrenciesList();

    const adapter = new FileSync(dbCurrenciesPath);
    const db = low(adapter);

    db.defaults({ currencies: [] })
        .write();
    db.set('currencies', list)
        .write();
}

function createDbFile() {
    const adapter = new FileSync(dbPath);
    const db = low(adapter);

    db.defaults({ ...defaults })
        .write();
}

saveList();
createDbFile();
