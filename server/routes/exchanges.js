const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const { dbPath } = require('../config');

const adapter = new FileAsync(dbPath);

module.exports = async (req, res) => {
    const db = await low(adapter);
    const exchanges = db.get('exchanges').value();

    res.send(exchanges);
};
