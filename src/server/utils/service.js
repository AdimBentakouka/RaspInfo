var express = require('express')
var app = express.Router()
const { exec } = require('child_process');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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
app.get('/', function (e) {
    //Tous les services
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

            // Vérifie cas spécial pour PlexMediaServer
            exec("sudo service plexmediaserver status",(err) =>
            {
                // Soit le service existe pas ou le service n'est pas démarré, cela déclanche une erreur
                if(err)
                {
                    //service désactivé

                    if(err.code != 4) // code = 4 service non trouvé
                    {
                        response[Object.keys(response).length] = {"etat": false, "serviceName": "plexmediaserver"};
                    }


                }
                else
                {
                    //si pas d'erreur, le service est lancé
                    response[Object.keys(response).length] = {"etat": true, "serviceName": "plexmediaserver"};
                }

                e.res.send(response);

            });


        }

    });

})

/**
 * @api {post} /service Définir l'état d'un service
 * @apiVersion 1.0.0
 * @apiName setService
 * @apiGroup Service
 *
 * @apiParam {String} serviceAction Le paramètre doit être égal à ["start","stop","restart"].
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
 * @apiError {int} code Code de retour, [500] => Action introuvable, [501] => Nom de service introuvable.
 * @apiError {String} msg Message d'erreur de retour.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found

         {
             code:501,
             msg:"L'action : test n'est pas pris en charge par l'application.",
         }

 * @apiSampleRequest /service
 */
.post('/', function(req,res)  {
    var serviceName = req.body.serviceName;
    var serviceAction = req.body.serviceAction;


    if(serviceName == "" || serviceAction == "")
    {
        res.send(
        {
            code:500,
            msg:"Le nom du service ou l'action est manquant",
            data:
            {
                serviceName: serviceName,
                serviceAction: serviceAction
            }
        });
    }
    else
    {
        let commandService = "";
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
                    code:501,
                    msg:"L'action : "+serviceAction + " n'est pas pris en charge par l'application.",
                });
        }
        if(commandService !== "")
        {
            exec(commandService, (err) => {
                if(err)
                {
                    res.send(
                    {
                        code:501,
                        msg: "Error: L'action "+serviceAction+" sur le service "+serviceName+" n'as pas aboutie. "
                    });
                }
                else
                {
                    res.send(
                    {
                        code:200,
                        data:
                        {
                            "serviceName": serviceName,
                            "serviceAction": serviceAction
                        }
                    });
                }
            });
        }
    }

});

module.exports = app;
