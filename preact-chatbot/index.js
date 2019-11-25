import './style';
import 'bootstrap/dist/css/bootstrap.css';
import { Component } from 'preact';
import Pusher from 'pusher-js';
//import { InputGroup } from 'react-bootstrap';



//var recognised = document.getElementById("recognised");


/*UserMessage contiene el valor de lo que el
usuario escriba en el campo de entrada*/

/*Conversation es una matriz que contendrá
cada mensaje en la conversación*/

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userMessage: '',
      conversation: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.getElementById = this.getElementById.bind(this);
  }

  onSend([message]) {
    if (message.text) {
      let msg = {
        text: message.text,
        user: 'user',
      };
    if (this.attachment) { // check if the user attached something
      const filename = this.attachment.name;
      const type = this.attachment.file_type;
        msg.attachment = {
          file: {
            uri: this.attachment.uri,
            type: type,
            name: `${filename}`
          },
          name: `${filename}`,
          type: this.attachment.type
          };
        }
      this.currentUser.sendMessage(msg).then(() => {
        this.attachment = null;
      });
    }
  }


  /*La 'handleChange' función se ejecuta en cada pulsación
  de tecla para actualizar, lo 'userMessageque' permite que
  el valor visualizado se actualice a medida que el usuario
  escribe. Cuando el usuario presione Enter, se
  enviará el formulario y 'handleSubmit' se invocará.*/

  /*'handleSubmit' actualiza el 'conversation' con el
  contenido del mensaje del usuario y envía el mensaje en
  una POSTsolicitud al /chat configurado en el servidor de la aplicación.*/

  componentDidMount() {
    const pusher = new Pusher('be83434d848b1e107803', {
      cluster: 'mt1',
      encrypted: true,
    });

    const channel = pusher.subscribe('bot');
    channel.bind('bot-response', data => {
      const msg = {
        text: data.message,
        user: 'ai',
      };
      this.setState({
        conversation: [...this.state.conversation, msg],
      });
    });
  }

  handleChange(event) {
    this.setState({ userMessage: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const msg = {
      text: this.state.userMessage,
      user: 'user',
    };

    this.setState({
      conversation: [...this.state.conversation, msg],
    });

    //fetch('http://192.168.0.105:7777/chat', { //para pruebas usar localhost
    fetch('http://localhost:7777/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: this.state.userMessage,
      }),
    });

    this.setState({ userMessage: '' });
  }

  render() {
    const ChatBubble = (text, i, className) => {
      const classes = `${className} chat-bubble`;
      return (
        <div key={`${className}-${i}`} class={`${className} chat-bubble`}>
          <span class="chat-content">{text}</span>
        </div>
      );
    };

    const chat = this.state.conversation.map((e, index) =>
      ChatBubble(e.text, index, e.user)
    );


    return (
      <div>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
		    <script type="text/javascript" src="recorder.js"> </script>
      </head>
        <div class="msj-rta macro" style="margin:auto">
          <div class="chat-window">
            <div class="title">
              <img class="avatar" src="https://placeimg.com/40/40/arch?1"/>
              <span> CHATBOT WIT.AI </span>
            </div>
            <div class="text text-r" style="background:whitesmoke !important">
            <div class="conversation-view">{chat}</div>
            <div class="message-box">
             <div class="colum">
                <form onSubmit={this.handleSubmit}>
                <div>
                  <input
                    value={this.state.userMessage}
                    onInput={this.handleChange}
                    class="text-input"
                    type="text"
                    autofocus
                    aria-describedby="basic-addon1"
                    placeholder="Escribe tu mensaje y presiona enter para enviar"
                  />
                </div>
                </form>
              </div>
             </div>
            </div>
            <form class="text-input" action ='http://192.168.0.105:7777/uploadFile' method="POST" enctype="multipart/form-data">
              <input type="file" name="file" accept="audio/*" capture="microphone"/>
              <input type="submit" value="Subir" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
