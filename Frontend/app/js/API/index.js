import Data from '../util/Data.js';
import DayNight from './daynight.js';
import Facts from './facts.js';
import History from './history.js';

export default class API {

    _facts = new Facts(this);
    _history = new History(this);
    _daynight = new DayNight(this);

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

    get history() {
        return this._history;
    }
    get daynight() {
        return this._daynight;
    }

    set host(h) {
        this._host = h;
    }

}