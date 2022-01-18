import Data from '../util/Data.js';
import Facts from './facts.js';

export default class API {

    _facts = new Facts(this);

    constructor(app) {
        this.app = app;

        this._host = "http://localhost:5001/api/v1";
        

        Object.assign(this, Data);
    }

    get host(){
        return this._host;
    }

    get facts() {
        return this._facts;
    }

    set host(h) {
        this._host = h;
    }

}