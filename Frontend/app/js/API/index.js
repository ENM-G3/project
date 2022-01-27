import Data from '../util/Data.js';
import Average from './average.js';
import DayNight from './daynight.js';
import Facts from './facts.js';
import History from './history.js';

export default class API {

    constructor(app) {

        this.app = app;

        this.host = `http://${this.app.hostname}/api/v1`;

        Object.assign(this, Data);

        
        this.facts = new Facts(this);
        this.history = new History(this);
        this.daynight = new DayNight(this);
        this.average = new Average(this);
        
    }

}