const { runWatchers, removeClient, addClient } = require('../watcher');

// eslint-disable-next-line consistent-return
const getPlatforms = (selectedAssets = {}) => {
    const { quoteAssets } = selectedAssets;
    if (quoteAssets && quoteAssets.length) {
        const plats = quoteAssets.reduce((prev, curr) => {
            const { exchange } = curr;
            if (!prev.includes(exchange)) { prev.push(exchange); }
            return prev;
        }, []);
        return plats;
    }
};

module.exports = (io) => {
    let timersIds = {};
    const stopWatchers = () => {
        if (timersIds) {
            Object.keys(timersIds).forEach((t) => clearInterval(timersIds[t]));
            timersIds = {};
        }
    };

    io.on('connection', (client) => {
        client.on('subscribeToUpdates', (assets) => {
            stopWatchers();
            timersIds = runWatchers(getPlatforms(assets), assets);
            addClient(client);
        });

        client.on('stopWatchers', () => {
            console.log('Socket.io: stop watchers');
            stopWatchers();
        });

        client.on('runWatchers', (assets) => {
            stopWatchers();
            timersIds = runWatchers(getPlatforms(assets), assets);
        });

        client.on('disconnect', () => {
            console.log('Socket.io: client disconnected');
            removeClient(client);
        });

        client.on('unsubscribe', () => {
            console.log('Socket.io: client unsubscribed');
            removeClient(client);
        });
    });
};
