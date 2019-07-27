/**
*   Fonction utiles
*/

const { exec } = require('child_process');

function reboot()
{
    exec("sudo reboot");
}

exports.reboot = reboot;
