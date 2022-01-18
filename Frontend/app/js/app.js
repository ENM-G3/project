import * as SocketIO from './lib/socket.io.min.js' ;
import Socket from './SOCKET/index.js';
import API from './API/index.js';


export default class App {
    _hostname = "localhost:5000";
    _socketio = io(this.hostname);
    _socket = new Socket(this);
    _api = new API(this);

    constructor() {
        this.init();
    }

    get socketio() {
        return this._socketio;
    }

    get socket() {
        return this._socket;
    }

    get api() {
        return this._api;
    }

    async init() {

        // hier komen de listeners, structuur nog uit te zoeken
        console.log("App has been initialized!");
        console.log();
        console.log(await this.api.facts.getByType("weetje"));
        
    }

    domReady(e) {
        this.body = document.body;
    }
    
}