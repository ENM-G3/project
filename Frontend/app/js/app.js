import * as SocketIO from './lib/socket.io.min.js' ;
import Socket from './SOCKET/index.js';


export default class App {
    _hostname = "localhost:5000";
    _socketio = io(this.hostname);
    _socket = new Socket(this);

    constructor() {
        this.init();
    }

    get socketio() {
        return this._socketio;
    }

    get socket() {
        return this._socket;
    }

    async init() {

        // hier komen de listeners, structuur nog uit te zoeken
        console.log("App has been initialized!");
    }

    domReady(e) {
        this.body = document.body;
    }
    
}