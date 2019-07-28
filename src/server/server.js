var express = require('express');

var config = require('./helper/configServer');

var info = require('./utils/info');
var system = require('./utils/system');
var service = require('./utils/service');

var app = express();

app.use(express.json());

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
 console.log('Api RemoteBerry start on http://localhost'+config.port);
});
