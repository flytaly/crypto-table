const binance = require('./exchanges/binance');
const { updateInterval } = require('../config');

function watcher(exchange, tickerCreator, interval, client) {
    let exchangeTicker = tickerCreator();

    const timerId = setInterval(async () => {
        const ticker = await exchangeTicker();
        if (!ticker.error) {
            client.emit('ticker', { exchange, ticker });
        } else {
            console.error(`${exchange} error: `, ticker.error);
            exchangeTicker = tickerCreator();
        }
    }, interval);

    return timerId;
}

function runWatchers(socketClient) {
    const binanceTimerId = watcher('binance', binance, updateInterval, socketClient);

    return { binance: binanceTimerId };
}

module.exports = { runWatchers };
