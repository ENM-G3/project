import { signalR } from "./lib/signalr.min";

export default class App {

    constructor() {
        this.init();
    }

    async init() {
        this.connection = new signalR.HubConnectionBuilder().withUrl("/influx")
        console.log("App has been initialized!");
    }

    domReady(e) {
        this.body = document.body;
    }
    
}