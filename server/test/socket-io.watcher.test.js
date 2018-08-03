const { expect } = require('chai');
const io = require('socket.io-client');
const nock = require('nock');
const config = require('../config');
const server = require('../index');
const binanceMocking = require('./mock/binance-responses');

const socketURL = `${config.host}:${config.port}`;

const clients = [];

after((done) => {
    clients.forEach(c => c.disconnect());
    server.close();
    done();
});

describe('Socket.IO watcher', () => {
    it('should receive ticker', (done) => {
        nock('https://api.binance.com')
            .get('/api/v1/exchangeInfo')
            .reply(200, binanceMocking.info)
            .get('/api/v3/ticker/price')
            .reply(200, binanceMocking.ticker);

        const client = io.connect(socketURL);

        clients.push(client);

        client.on('connect', () => {
            client.emit('subscribeToUpdates');
        });

        client.on('ticker', (ticker) => {
            expect(ticker).to.have.property('ticker');
            client.emit('stopWatch');
            done();
        });
    });
});
