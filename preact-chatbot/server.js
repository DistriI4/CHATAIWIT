//import Artyom from 'artyom.js';
//Jarvis.say("Hola, me gustaría conocerte más!");
//import {Artyom} from './a/index.js'

require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Wit } = require('node-wit');
const Pusher = require('pusher');


var $ = require('jquery');
// Activacion de libreria para Jquery
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('').window);
global.document = document;
var $ = jQuery = require('jQuery')(window);

var WitSpeech = require('node-witai-speech');
var fs = require('fs');



// PUSHER
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true,
});

const client = new Wit({
  accessToken: process.env.WIT_ACCESS_TOKEN,
});





var comando = "OFF";

const app = express();

//var estado = "OFF";

var API_KEY = process.env.WIT_ACCESS_TOKEN;
var content_type = "audio/wav";

/*app.post('/upload',(req,res) => {
  let EDFile = req.files.file
  //var stream2 = fs.createReadStream(`files/${EDFile.name}`);
  /*var API_KEY = process.env.WIT_ACCESS_TOKEN;
  var content_type = "audio/wav";
  var parseSpeech =  new Promise((ressolve, reject) => {
      // call the wit.ai api with the created stream
      WitSpeech.extractSpeechIntent(process.env.WIT_ACCESS_TOKEN, stream2, content_type,
      (err, res) => {
          if (err) return reject(err);
          ressolve(res);
          console.log(res);
      });
  });*/

/* Guarda los archivos en el servidor
  EDFile.mv(`./files/${EDFile.name}`,err => {
    var stream2 = fs.createReadStream(`files/${EDFile.name}`);
    var parseSpeech =  new Promise((ressolve, reject) => {
        // call the wit.ai api with the created stream
        WitSpeech.extractSpeechIntent(process.env.WIT_ACCESS_TOKEN, stream2, content_type,
        (err, res) => {
            if (err) return reject(err);
            ressolve(res);
            console.log(res);
        });
    });
       if(err) return res.status(500).send({ message : err })

       return res.status(200).send({ message : 'File upload' })
   })
});*/

app.use(fileUpload());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*var stream = fs.createReadStream('D:/Grabaciones/archivo.wav');
var API_KEY = process.env.WIT_ACCESS_TOKEN;
var content_type = "audio/wav";
var parseSpeech =  new Promise((ressolve, reject) => {
    // call the wit.ai api with the created stream
    WitSpeech.extractSpeechIntent(process.env.WIT_ACCESS_TOKEN, stream, content_type,
    (err, res) => {
        if (err) return reject(err);
        ressolve(res);
    });
});
parseSpeech.then((data) => {
  console.log(data);
  handleMessage(data);
})
.catch((err) => {
    console.log(err);
});*/



app.post('/chat', (req, res) => {

  const { message } = req.body;
  let EDFile = req.files.file;
  //var stream2 = fs.createReadStream(`files/${EDFile.name}`);
  EDFile.mv(`./files/${EDFile.name}`,err => {
  //var stream2 = fs.createReadStream(`files/${EDFile.name}`);
       //if(err) return res.status(500).send({ message : err })
       //return res.status(200).send({ message : 'File upload' })
   })
   var stream2 = fs.createReadStream(`files/${EDFile.name}`);
   var parseSpeech =  new Promise((ressolve, reject) => {
         // call the wit.ai api with the created stream
         WitSpeech.extractSpeechIntent(process.env.WIT_ACCESS_TOKEN, stream2, content_type,
         (err, res) => {
             if (err) return reject(err);
             ressolve(res);
         });
     });



  const responses = {
    greetings: ["Hola, how's it going?", "What's good with you?"],

    jokes: [
      'Do I lose when the police officer says papers and I say scissors?',
      'I have clean conscience. I haven’t used it once till now.',
      'Did you hear about the crook who stole a calendar? He got twelve months.',
    ],

    action: [
      'encendiendo', 'apagando',
    ],

    state: [
      'El dispositivo se encuentra encendido', 'El dispositivo se encuentra apagado',
    ],
  };

  const firstEntityValue = (entities, entity) => {
    const val =
      entities &&
      entities[entity] &&
      Array.isArray(entities[entity]) &&
      entities[entity].length > 0 &&
      entities[entity][0].value;

    if (!val) {
      return null;
    }

    return val;
  };

  const handleMessage = ({ entities }) => {
    const greetings = firstEntityValue(entities, 'greetings');
    const action = firstEntityValue(entities, 'getAccion');
    const device = firstEntityValue(entities, 'dispositivo');
    const state = firstEntityValue(entities, 'getState');

    if (greetings) {
      return pusher.trigger('bot', 'bot-response', {
        message:
          responses.greetings[
            Math.floor(Math.random() * responses.greetings.length)
          ],
      });
    }

    if (action === 'Encender' || action === 'Enciende' || action === 'Prender' && device) {
      comando = "ON";
      //sendCommand(comando);
      return pusher.trigger('bot', 'bot-response', {
        message:
          responses.action[0] +" "+ device,
      });
    }

    if (action === 'Apagar' || action === 'Apaga' && device) {
      comando = "OFF";
      //sendCommand(comando);
      return pusher.trigger('bot', 'bot-response', {
        message:
          responses.action[1] +" "+ device,
      });
    };
    return pusher.trigger('bot', 'bot-response', {
      message: 'Hola ¿En qué puedo ayudar?',
    });
  };

  parseSpeech.then((data) => {
    console.log(data);
    handleMessage(data);
  })
  .catch((err) => {
      console.log(err);
  });

  client
    .message(message)
    .then(data => {
      handleMessage(data);
      //console.log(data);
    })
    .catch(error => console.log(error));
});



  //console.log(state);
  function getState()
  {
    console.log("Aqui empieza");
    var status = "0";
    var request = $.ajax
    ({
        type       : 'GET',
        //url        : 'http://192.168.43.54:8080/rest/items/milight_rgbiboxLed_F0FE6BA2F89E_ledcolor/state', //LOCAL
        url        :'https://isa_daya15@hotmail.com:Openhab.2019@home.myopenhab.org/rest/items/milight_rgbiboxLed_F0FE6BA2F89E_ledcolor/state' // REMOTO
        //url        : 'https://home.myopenhab.org/rest/items/milight_rgbiboxLed_F0FE6BA2F89E_ledbrightness/state'
    })
    //var status = JSON.parse(data);
    //console.log()
    request.done( function(data)
    {
        console.log( "Success: Status = " + data );
        //var status = data;
        //console.log(status);
        //status = data;
        //return(status);

    });
    request.fail( function(jqXHR, textStatus )
    {
        console.log( "Failure: " + textStatus );
        //return(data);
    });
    //var status = JSON.parse(data);

  }

//getState();

function setState( txtNewState )
{
  var request = $.ajax
  ({
      type       : "PUT",
      //url        : "http://192.168.1.14:8080/rest/items/milight_rgbiboxLed_F0FE6BA2F89E_animation_mode/state",
      data       : txtNewState,
      headers    : { "Content-Type": "text/plain", "Accept": "application/json"},
      dataType	 :	"text"
  });

  request.done( function(data)
  {
      console.log( "Success" );
  });

  request.fail( function(jqXHR, textStatus )
  {
      console.log( "Failure PUT: " + textStatus );
  });
}

var estado = 3;
//setState("2");


function sendCommand( txtCommand )
{
    var request = $.ajax
    ({
        type       : "POST",
        //url        : "http://192.168.43.54:8080/rest/items/milight_rgbiboxLed_F0FE6BA2F89E_animation_mode",
        url        : "https://isa_daya15@hotmail.com:Openhab.2019@home.myopenhab.org/rest/items/milight_rgbiboxLed_F0FE6BA2F89E_ledcolor",
        data       : txtCommand,
        headers    : { "Content-Type": "text/plain", "Accept": "application/json"},
        dataType	 :	"text"
    });

    request.done( function(data)
    {
        console.log( "Success: Status POST= " + data );
    });

    request.fail( function(jqXHR, textStatus )
    {
        console.log( "Failure POST: " + textStatus );
    });
}

//sendCommand(comando);


app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

/*var stream = fs.createReadStream('D:/Grabaciones/archivo2.wav');
// The wit.ai instance api key
var API_KEY = process.env.WIT_ACCESS_TOKEN;
var content_type = "audio/wav";
var parseSpeech =  new Promise((ressolve, reject) => {
    // call the wit.ai api with the created stream
    WitSpeech.extractSpeechIntent(process.env.WIT_ACCESS_TOKEN, stream, content_type,
    (err, res) => {
        if (err) return reject(err);
        ressolve(res);

    });
});
parseSpeech.then((data) => {
    //console.log(data);
})
.catch((err) => {
    console.log(err);
})*/



//grabar audio
