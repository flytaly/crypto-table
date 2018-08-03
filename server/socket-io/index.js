const { runWatchers } = require('../watcher');

module.exports = (io) => {
    let timersIds;

    io.on('connection', (client) => {
        client.on('subscribeToUpdates', () => {
            console.log('Socket.io: client subscribed');
            timersIds = runWatchers(client);
        });

        client.on('stopWatch', () => {
            console.log('Socket.io: stop watcher');
            Object.keys(timersIds).forEach(t => clearInterval(timersIds[t]));
        });
    });
};
