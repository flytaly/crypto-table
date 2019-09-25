/* eslint-disable import/order */
const app = require('express')();
const http = require('http').Server(app);

const config = require('./config');

require('dotenv').config();

global.fetch = require('node-fetch');
const cc = require('cryptocompare');

cc.setApiKey(process.env.CC_API_KEY);

app.set('port', config.port);

// Socket.IO
const io = require('socket.io')(http);
require('./socket-io')(io);

// ROUTES
const routes = require('./routes');

app.use(routes);

http.listen(app.get('port'), () => {
    console.log(`Server is up on ${app.get('port')} port`);
});

module.exports = http;
