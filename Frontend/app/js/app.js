import * as SocketIO from './lib/socket.io.min.js';
import Socket from './SOCKET/index.js';
import API from './API/index.js';
import Timer from './timer.js';
import Graphs from './graphs.js';
import Animation from './animation/index.js';


export default class App {
    _hostname = "enmg3backend.westeurope.azurecontainer.io:5000";

    _io = io(this._hostname);
    _socket = new Socket(this);
    _api = new API(this);
    _timer = new Timer(this);
    _graph = new Graphs(this);
    _animation = new Animation(this);

    constructor() {
        this.init();

        Object.assign(this, ApexCharts);
    }

    get socketio() {
        return this._io;
    }

    get socket() {
        return this._socket;
    }

    get api() {
        return this._api;
    }

    get charts() {
      return this._graph;
    }

    get animation() {
        return this._animation;
    }

    get hostname() {
        return this._hostname;
    }

    get timer() {
        return this._timer;
    }

    async init() {

        // hier komen de listeners, structuur nog uit te zoeken
        console.log("App has been initialized!");
        
    }

    domReady(e) {
        this.body = document.body;
    }
    
}