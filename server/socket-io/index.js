const { runWatcher, removeClient, addClient } = require('../watcher');

module.exports = (io) => {
    let timersIds;

    io.on('connection', (client) => {
        client.on('subscribeToUpdates', () => {
            console.log('Socket.io: client subscribed');
            if (!timersIds) timersIds = runWatcher();
            addClient(client);
        });

        client.on('stopWatchers', () => {
            console.log('Socket.io: stop watchers');
            Object.keys(timersIds).forEach(t => clearInterval(timersIds[t]));
            timersIds = null;
        });

        client.on('runWatcher', () => {
            if (!timersIds) timersIds = runWatcher();
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
