//import Artyom from 'artyom.js';
//Jarvis.say("Hola, me gustaría conocerte más!");
//import {Artyom} from './a/index.js'

require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Wit } = require('node-wit');
const Pusher = require('pusher');
const Artyom = require('artyom.js');

var $ = require('jquery');
// Activacion de libreria para Jquery
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('').window);
global.document = document;
var $ = jQuery = require('jQuery')(window);


/*function startArtyom(){
  artyom.initialize({
    lang:"es-ES",
    continuous:false,
    debug:true,
    listen:true
  });
}*/

//const artyom = new Artyom();

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




app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/chat', (req, res) => {
  const { message } = req.body;

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
    console.log(action);
    console.log(device);

    if (greetings) {
      return pusher.trigger('bot', 'bot-response', {
        message:
          responses.greetings[
            Math.floor(Math.random() * responses.greetings.length)
          ],
      });
    }

    if (action === 'Encender' || action === 'Enciende' || action === 'Prender' && device ==='luces'
    || device ==='refrigerador' || device ==='plancha' || device ==='cocina' ) {
      comando = "ON";
      //sendCommand(comando);
      //artyom.addCommands(comandoHola);
      return pusher.trigger('bot', 'bot-response', {
        message:
          responses.action[0] +" "+ device,
      });
    }
    /*else if (action ==='Encender' || action === 'Enciende'|| action === 'Prender' && device ==='refrigerador') {
      comando = "ON";
      sendCommand(comando);
      return pusher.trigger('bot', 'bot-response', {
        message:
          responses.action[0] +" "+ device,
      });
    }*/

    if (action === 'Apagar' || action === 'Apaga' && device ==='luces'
    || device ==='refrigerador' || device ==='plancha' || device ==='cocina') {
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

  client
    .message(message)
    .then(data => {
      handleMessage(data);
      console.log(data);
    })
    .catch(error => console.log(error));
});

  function getState()
  {
    console.log("Aqui empieza");
    var request = $.ajax
    ({
        type       : 'GET',
        //url        : 'http://192.168.43.54:8080/rest/items/milight_rgbiboxLed_F0FE6BA2F89E_ledcolor/state', //LOCAL
        url        :'https://isa_daya15@hotmail.com:Openhab.2019@home.myopenhab.org/rest/items/milight_rgbiboxLed_F0FE6BA2F89E_ledcolor/state' // REMOTO
        //dataType   :  'json',
        //contentType:  'application/json'
    })
    request.done( function(data)
    {
        console.log( "Success: Status = " + data );
    });
    request.fail( function(jqXHR, textStatus )
    {
        console.log( "Failure: " + textStatus );
    });

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
