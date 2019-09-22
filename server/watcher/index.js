const binance = require('./exchanges/binance');
const { updateInterval } = require('../config');

const clients = {};
const timers = {};

const platforms = {
    binance,
};
const defaultPlatform = 'binance';

function watcher(exchange, tickerCreator, interval) {
    let exchangeTicker = tickerCreator();

    const timerId = setInterval(async () => {
        const ticker = await exchangeTicker();
        if (!ticker.error) {
            Object.keys(clients).forEach((id) => clients[id].emit('ticker', { exchange, ticker }));
        } else {
            console.error(`${exchange} error: `, ticker.error);
            exchangeTicker = tickerCreator();
        }
    }, interval);

    return timerId;
}

function runWatcher(platform = defaultPlatform) {
    timers[platform] = watcher(platform, platforms[platform], updateInterval);

    return timers;
}

function addClient(socketClient) {
    clients[socketClient.id] = socketClient;
}

function removeClient(socketClient) {
    delete clients[socketClient.id];
}

module.exports = { addClient, removeClient, runWatcher };
