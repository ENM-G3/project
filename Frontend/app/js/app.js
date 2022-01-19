import * as SocketIO from './lib/socket.io.min.js';
import * as AC from './lib/apexcharts.min.js';
import Socket from './SOCKET/index.js';
import API from './API/index.js';
import Timer from './timer.js';
import Graphs from './graphs.js';


export default class App {
    _hostname = "localhost:5001";
    //_socketio = io(this.hostname);
    //_socket = new Socket(this);
    _api = new API(this);
    _timer = new Timer(this);
    _graph = new Graphs(this);

    constructor() {
        this.init();

        Object.assign(this, ApexCharts);
    }

    // get socketio() {
    //     return this._socketio;
    // }

    // get socket() {
    //     return this._socket;
    // }

    get api() {
        return this._api;
    }

    get charts() {
      return this._graph;
    }

    async init() {

        // hier komen de listeners, structuur nog uit te zoeken
        console.log("App has been initialized!");
        
    }

    domReady(e) {
        this.body = document.body;
    }
    
}