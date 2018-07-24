const express = require('express');

const app = express();

const config = require('./config');

app.set('port', config.port);

app.listen(app.get('port'), () => {
    console.log(`Server is up on ${app.get('port')} port`);
});
