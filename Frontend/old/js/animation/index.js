import Progress from "./progress.js";


export default class Animation {
    _progress = new Progress(this);

    constructor(app) {
        this.app = app;
    }



}