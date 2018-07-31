const binance = require('./exchanges/binance');
const { updateInterval } = require('../config');

function watcher(exchange, tickerCreator, interval) {
    let exchangeTicker = tickerCreator();

    const timerId = setInterval(async () => {
        const ticker = await exchangeTicker();
        if (!ticker.error) {
            // console.log('-->', 'ticker updated');
            // TODO: send ticker to client using socket.io
        } else {
            console.error(`${exchange} error: `, ticker.error);
            exchangeTicker = tickerCreator();
        }
    }, interval);

    return timerId;
}

function runWatchers() {
    const binanceTimerId = watcher('binance', binance, updateInterval);

    return { binance: binanceTimerId };
}

module.exports = { runWatchers, watcher };
