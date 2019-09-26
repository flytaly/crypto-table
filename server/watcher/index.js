const binance = require('./exchanges/binance');
const cryptocompare = require('./exchanges/cryptocompare');
const { updateInterval } = require('../config');

const clients = {};
const timers = {};

const platforms = {
    binance,
    cryptocompare,
};
const defaultPlatforms = ['binance'];

function watcher(exchange, tickerCreator, assets, interval) {
    let exchangeTicker = tickerCreator();

    const timerId = setInterval(async () => {
        const ticker = await exchangeTicker(assets);

        if (!ticker.error) {
            Object.keys(clients).forEach((id) => clients[id].emit('ticker', { exchange, ticker }));
        } else {
            console.error(`${exchange} error: `, ticker.error);
            exchangeTicker = tickerCreator();
        }
    }, interval);

    return timerId;
}

function runWatchers(watchPlatforms = defaultPlatforms, assets) {
    watchPlatforms.forEach((pl) => {
        timers[pl] = watcher(pl, platforms[pl], assets, updateInterval);
    });

    return timers;
}

function addClient(socketClient) {
    clients[socketClient.id] = socketClient;
}

function removeClient(socketClient) {
    delete clients[socketClient.id];
}

module.exports = { addClient, removeClient, runWatchers };
