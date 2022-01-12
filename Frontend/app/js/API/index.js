import Data from '../util/Data.js';

export default class API {

    constructor(app) {
        this.app = app;

        this._host = "";

        Object.assign(this, Data);
    }

    get host(){
        return this._host;
    }

    set host(h) {
        this._host = h;
    }

}