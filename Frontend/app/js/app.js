import * as SocketIO from './lib/socket.io.min.js';
import API from './API/index.js';
import Timer from './timer.js';
import Graphs from './graphs.js';
import Socket from './socket.js';


export default class App {


    constructor() {
        this.hostname = "enmg3backend.westeurope.azurecontainer.io:5000";
        this.io = io(this.hostname);
        
        this.api = new API(this);
        this.timer = new Timer(this);
        this.graph = new Graphs(this);
        this.Socket = new Socket(this);

        this.init();
    }


    async init() {
        // hier komen de listeners, structuur nog uit te zoeken
    
        await this.waitForLoad();
        //this.removeLoader();

    }


    // function for starting async functions to see if all elements are loaded.
    async waitForLoad() {
        try {
            
            return true;
        } catch(e) {
            console.log(e);
            throw e;
        }
    }

    domReady(e) {
        this.body = document.body;
    }
    
}