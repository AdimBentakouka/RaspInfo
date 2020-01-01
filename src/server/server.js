var express = require('express');

var config = require('./helper/configServer');

var info = require('./utils/info');
var system = require('./utils/system');
var service = require('./utils/service');

var app = express();

app.use(express.json());

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    app.options('*', (_req, res) => {
        // allowed XHR methods
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

//Rend le dossier apidoc consultable
app.use(express.static('apidoc'));

//Affiche la documentation de l'API
app.get('/', function(e){
    e.res.sendFile('/apidoc/index.html');
})

.use('/getInfo', info)
.use('/system',system)
.use('/service',service)

.listen(config.port, function () {
 console.log('Api RaspInfo start on http://localhost:'+config.port);
});
