const nock = require('nock');
const { expect } = require('chai');

const binanceMocking = require('./mock/banance-responses');
const binanceTickerCreator = require('../watcher/exchanges/binance');

after((done) => {
    nock.cleanAll();
    done();
});

describe('Test exchanges API', () => {
    describe('Binance', () => {
        it('should return formatted ticker', async () => {
            nock('https://api.binance.com')
                .get('/api/v1/exchangeInfo')
                .reply(200, binanceMocking.info)
                .get('/api/v3/ticker/price')
                .reply(200, binanceMocking.ticker);

            const getTicker = binanceTickerCreator();
            const ticker = await getTicker();
            expect(ticker).to.deep.equal(binanceMocking.formattedTicker);
        });

        it('should contain error object', async () => {
            nock('https://api.binance.com')
                .get('/api/v1/exchangeInfo')
                .reply(400, { error: 'something happened' });

            const getTicker = binanceTickerCreator();
            const ticker = await getTicker();

            expect(ticker).to.have.property('error');
        });
    });
});
