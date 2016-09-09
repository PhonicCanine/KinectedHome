var regex = /(.*)\\.*/
var path = regex.exec(require.main.filename)[1];
console.log(path)
var keyToSend = "&hAD"
var theJobType = ' "'+keyToSend+'"';
var exec = require('child_process').exec;
var child = exec('wscript ' + path + '/sendKey.vbs' + theJobType, function( error, stdout, stderr) 
   {
       if ( error != null ) {
            console.log(stderr);
            // error handling & exit
       }

       // normal 

   });

