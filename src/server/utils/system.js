var express = require('express')
var app = express.Router()
const { exec } = require('child_process');
app

/**
 * @api {get} /system/reboot Restart Raspberry après 5s
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
 *  @apiSampleRequest /system/reboot
*/
.get('/reboot', function(e) {

    //pour avoir une reponse lors de l'execution de la commande
    setTimeout(() =>
    {
            exec("sudo reboot");
    }, 5000, 'reboot after 5s');
    //reponse
    e.res.send({
        code:200,
        data:'Commande Envoyé'
    });
})

/**
 * @api {get} /system/shutdown Eteint la Raspberry après 5s
 * @apiVersion 1.0.0
 * @apiName shutdown
 * @apiGroup System

 * @apiSuccess {int} code Code de retour.
 * @apiSuccess {String} data  Contient la réponse

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "code":200,
            "data": "Commande Envoyé"
 *     }
 *  @apiSampleRequest /system/shutdown
*/
.get('/shutdown', function(e)
{
    setTimeout(() => {
        exec("sudo shutdown -h now");
    },5000, 'Shutdown after 5s');

    e.res.send({
        code:200,
        data:'Commande Envoyé'
    })
});

module.exports = app;
