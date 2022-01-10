export default class App {

    constructor() {
        this.init();
    }

    async init() {
        console.log("App has been initialized!");
    }

    domReady(e) {
        this.body = document.body;
    }
    
}