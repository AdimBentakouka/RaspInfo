const express = require('express')
const app = express()
const { exec } = require('child_process');

const config = require('./helper/configServer');
const func = require('./helper/function');

app.use(express.static('apidoc'));


app.get('/', function(e){
    e.res.sendFile('/apidoc/index.html');
});

/**
 * @api {get} /getInfo/memoire Affiche les informations de la RAM
 * @apiVersion 1.0.0
 * @apiName Memoire
 * @apiGroup GetInfo

 *
 * @apiSuccess {int} code Code de retour.
 * @apiSuccess {array[]} data[]  Contient le détail de tous les HDD.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "code":200,
            "data":
            [
                {
                    "total":"1,9G",
                    "used":"181M",
                    "free":"1,5G",
                    "shared":"6,1M",
                    "buff/cache":"241M",
                    "available":"1,6G"
                }
                ...
 *     }
 *
 * @apiError {int} code Code de retour.
 * @apiError {String} msg Message d'erreur de retour.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *          "code": 500,
            "msg": "'free' n'est pas reconnu en tant que commande interne\r\nou externe, un programme exécutable ou un fichier de commandes.\r\n"
 *     }
 *  @apiSampleRequest /getInfo/memoire
 */
app.get('/getInfo/memoire', function (e) {

    exec('free -h', (err, stdout, stderr) => {
        if(err)
        {
            e.res.send(
            {
                code:500,
                msg: stderr
            });
        }
        else
        {
            let data = stdout.split(/[\r\n|\n]/);
            let response = [];

            data.forEach(function(element, index)
            {
                let item = element.split(/\s+/g);
                if(index != 0 && element != "")
                {
                    response[index-1]=
                    {
                        'total': item[1],
                        'used': item[2],
                        'free': item[3],
                        'shared': item[4],
                        'buff/cache': item[5],
                        'available': item[6]
                    };

                }
            });

            response = {
                code: 200,
                data:response
            }
            e.res.json(response);
        }

    });
});

/**
 * @api {get} /getInfo/hdd Affiches l'espace de stockages des HDDs
 * @apiVersion 1.0.0
 * @apiName HDD
 * @apiGroup GetInfo

 * @apiSuccess {int} code Code de retour.
 * @apiSuccess {array[]} data[]  Contient le détail de tous les HDD.

 * @apiSuccessExample Success-Response:
 {
    "code": 200,
    "data": [
        {
            "Filesystem": "udev",
            "Size": "972M",
            "Used": "0",
            "Avail": "972M",
            "Usepercent": "0%",
            "MountedOn": "/dev"
        },
        ...
    ]
}
 * @apiError {int} code Code de retour.
 * @apiError {String} msg Message d'erreur de retour.
 * @apiErrorExample Error-Response:
     {
        "code": 500,
        "msg": "'df' n'est pas reconnu en tant que commande interne\r\nou externe, un programme exécutable ou un fichier de commandes.\r\n"
    }
 *  @apiSampleRequest /getInfo/hdd
 */
app.get('/getInfo/hdd', function (e) {

    exec('df -h', (err, stdout, stderr) => {
        if(err)
        {
            e.res.send(
            {
                code:500,
                msg: stderr
            });
        }
        else
        {
            let data = stdout.split(/[\r\n|\n]/);
            let response = [];

            data.forEach(function(element, index)
            {
                let item = element.split(/\s+/g);
                if(index != 0 && element != "")
                {
                    response[index-1]=
                    {
                        'Filesystem': item[0],
                        'Size': item[1],
                        'Used': item[2],
                        'Avail': item[3],
                        'Usepercent': item[4],
                        'MountedOn': item[5]
                    };

                }
            });

            response = {
                code: 200,
                data:response
            }
            e.res.send(response);
        }

    });
});

/**
 * @api {get} /getInfo/temp Affiches la température
 * @apiVersion 1.0.0
 * @apiName Temp
 * @apiGroup GetInfo

 * @apiSuccess {int} code Code de retour.
 * @apiSuccess {String} data  Contient la température

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "code":200,
            "data": "XX °C"
 *     }
 *
 * @apiError {int} code Code de retour.
 * @apiError {String} msg Message d'erreur de retour.
 * @apiErrorExample Error-Response:
     {
         "code": 500,
         "msg": "/bin/sh: 1: /opt/vc/bin/vcgencmd: not found\n"
     }
 *  @apiSampleRequest /getInfo/temp
 */
app.get('/getInfo/temp', function(e) {

    exec("/opt/vc/bin/vcgencmd measure_temp", (err, stdout, stderr) => {
        if(err)
        {
            e.res.send(
            {
                code:500,
                msg: stderr
            });
        }
        else
        {
            let json =
            {
                code:200,
                temperature: stdout.substr(5)
            }
            e.res.send(json);
        }
    });
});

/**
 * @api {get} /reboot Restart Raspberry après 5s
 * @apiVersion 1.0.0
 * @apiName reboot
 * @apiGroup System

 * @apiSuccess {int} code Code de retour.
 * @apiSuccess {String} data  Contient la réponse

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "code":200,
            "data": "Commande Envoyé"
 *     }
 *  @apiSampleRequest /reboot
 */
app.get('/reboot', function(e) {

    setTimeout(func.reboot, 5000, 'reboot after 5s');
    e.res.send({
        code:200,
        data:'Commande Envoyé'
    });
});


/**
 * @api {get} /service Afficher l'état de tout les services
 * @apiVersion 1.0.0
 * @apiName Service
 * @apiGroup Service

 * @apiSuccess {int} code Code de retour.
 * @apiSuccess {array[]} data[]  Contient le détail de tous les services

 * @apiSuccessExample Success-Response:
 *     {
            "0": {
                "etat": true,
                "serviceName": "alsa-utils"
            },
            "1": {
                "etat": true,
                "serviceName": "avahi-daemon"
            },
            "2": {
                "etat": true,
                "serviceName": "binfmt-support"
            },
            "3": {
                "etat": false,
                "serviceName": "bluetooth"
            }
            ...
        }
 *
 * @apiError {int} code Code de retour.
 * @apiError {String} msg Message d'erreur de retour.
 * @apiErrorExample Error-Response:
     {
    "code": 500,
    "msg": "'service' n'est pas reconnu en tant que commande interne\r\nou externe, un programme ex�cutable ou un fichier de commandes.\r\n"
    }
 *  @apiSampleRequest /service
 */
app.get('/service', function (e) {
    exec("service --status-all", (err, stdout, stderr) => {
        if(err)
        {
            e.res.send(
            {
                code:500,
                msg: stderr
            });
        }
        else
        {
            let data = stdout.split(/[\r\n|\n]/);
            let response = {};

            data.forEach(function(element, index)
            {
                let item = element.split(' ');

                let etat = false;
                if(item[2] == '+')
                {
                    etat = true;
                }

                response[index] =
                {
                    etat: etat,
                    serviceName: item[5]
                };


            });
            e.res.send(response);
        }

    });
})

/**
 * @api {get} /service/:action/:serviceName Permet de définir l'état d'un service
 * @apiName setService
 * @apiGroup Service
 *
 * @apiParam {String} action Le paramètre doit être égal à ["start","stop","restart"].
 * @apiParam {String} serviceName Le nom du service.
 *
 * @apiSuccess {int} Code de retour.
 * @apiSuccess {Array[]} data  Contient la réponse.
 * @apiSuccess {String} data.serviceName  Le service concernée
 * @apiSuccess {String} data.serviceAction  Action demandée.
 *
 * @apiSuccessExample Success-Response:
 *     code:200,
       data:
       {
           "serviceName": serviceName,
           "serviceAction": serviceAction
       }
 *
 * @apiError {int} code Code de retour.
 * @apiError {String} msg Message d'erreur de retour.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "code":500,
         "msg": ":action ou :serviceName n'est pas définit"
 *     }
 * @apiSampleRequest /service/:action/:serviceName
 */
app.get('/service/:action/:serviceName', function(req, res)
{
    var serviceName = req.params.serviceName;
    var serviceAction = req.params.action;

    var commandService = "";

    switch(serviceAction)
    {
        case "start":
        case "stop":
        case "restart":
            commandService = "sudo service "+serviceName + " "+serviceAction;
            break;
        default:
            res.send(
            {
                code:500,
                msg:"L'action : "+serviceAction + " n'est pas pris en charge par l'application."
            });

    }
    if(commandService !== "")
    {
        exec(commandService, (err, stderr) => {
            if(err)
            {
                res.send(
                {
                    code:500,
                    msg: stderr
                });
            }

            res.send(
            {
                code:200,
                data:
                {
                    "serviceName": serviceName,
                    "serviceAction": serviceAction
                }
            });
        });
    }

});


app.listen(config.port, function () {
 console.log('Api RemoteBerry start on http://localhost'+config.port);
})
