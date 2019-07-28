var express = require('express')
var app = express.Router()
var { exec } = require('child_process');


app
/**
     * @api {get} /getInfo/memoire Affiche les informations de la RAM
     * @apiVersion 1.0.0
     * @apiName Memoire
     * @apiGroup GetInfo
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
**/
.get('/memoire', function (e) {
    exec('free -h', (err, stdout, stderr) =>
    {
        if(err)
        {
            e.res.send({
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
                    response[index-1] = {
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
})

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
.get('/temp', function(e) {
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

module.exports = app;
