function pulsar(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        var boton = document.getElementById("boton");
        angular.element(boton).triggerHandler('click',()=>{
          this.state.userMessage(document.getElementById("texto").value);
        });
    }
}
function decir(texto){
  speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
}

function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

const artyom = new Artyom();
const recognised = document.getElementById("recognised");

// This function activates artyom and will listen all that you say forever (requires https conection, otherwise a dialog will request if you allow the use of the microphone)
function startContinuousArtyom() {
  artyom.fatality();
  setTimeout(function() {
    artyom
      .initialize({
        lang: "es-ES",
        continuous: true, // Artyom will listen forever
        listen: true, // Start recognizing
        debug: true, // Show everything in the console
        speed: 1 // talk normally
      })
      .then(function() {
        console.log("Ready to work!");
      });
    artyom.redirectRecognizedTextOutput(function(text, isFinal) {
      recognised.innerText = text;
    });
  }, 250);
}

const thingsToSay = {
  "where am i": "Camp JS",
  "what day is it": "Sunday",
  "who am i": "you tell me"
};

artyom.on("*", true).then((i, wildcard) => {
  recognised.innerText = wildcard;
  var commands = Object.keys(thingsToSay);
  for (let cmd of commands) {
    if (wildcard.toLowerCase().indexOf(cmd) > -1) {
      artyom.say(thingsToSay[wildcard]);
    }
  }
});

//startContinuousArtyom();

// artyom.on(['When I say *'], true).then((i,wildcard) => {
//   var instruction = /([\w ]+) you say ([\w ]+)/;
//   var result = instruction.exec(wildcard);
//   if (result) {
//     thingsToSay[result[1]] = result[2];
//     artyom.say(`Okay, I will say ${result[2]} when you say ${result[1]}`);
//   } else {
//     artyom.say(`I heard ${wildcard} and didn't know what to do`);
//   }
// });
