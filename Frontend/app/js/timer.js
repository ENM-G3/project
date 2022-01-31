import Data from './util/Data.js';


export default class Timer {
    constructor(app) {
        this.app = app;
        this.interval = 2;
        this.updateInterval = 60 * 5; // Time between updated of data

        this.order = [];
        Object.assign(this, Data);

        this.slideObjects = [];
    }


    async init() {
        document.documentElement.style.setProperty('--global-progress-duration', `${this.interval}s`);

        this.slider = document.querySelector(".slider");
        this.slides = document.querySelectorAll(".slide");

        this.num_items = this.slides.length;

        for (let i = 1; i <= this.num_items; i++) {
            this.order.push(i);
        }

        this.current = 1;
        this.last = this.num_items;
        
        this.slides.forEach((element, index) => {
            element.style.order = this.order[index];
        });

        this.slideIndicator();
        this.startInterval();
        this.startUpdateInterval();
    }

    startInterval() {
        setInterval(this.gotoNext.bind(this), this.interval * 1000);
    }

    startUpdateInterval() {
        setInterval(this.app.updateData.bind(this.app), this.updateInterval * 1000);
    }

    changeOrder() {
        for (let i = 0; i < this.num_items; i++) {
            this.slides[i].style.order = this.order[i];
            if (this.slides[i].style.order != 1) {
                this.slides[i].classList.add('invisible');
            } else {
                this.slides[i].classList.remove('invisible');
            }
        }

        let el = document.querySelector(`#progress .progress-done`);
        el.style.animation = 'none';
        el.offsetHeight; /* trigger reflow */
        el.style.animation = null; 

        this.slideIndicator();
    }

    gotoNext () {
        if (this.order.length == this.current) {
            this.current = 1;
        } else {
            this.current++;
        }
        if (this.current == 2) {
            this.last = 1;
        } else {
            this.last++;
        }

        this.order.unshift(this.order[this.order.length - 1]);
        this.order.pop();

        this.removeIndicatorAnimations();
        this.changeOrder();
    }

    slideIndicator() {
        document.querySelector(`#progress .progress-done`).classList.add("progress-done-animation");
    }

    removeIndicatorAnimations() {
        document.querySelector(`#progress .progress-done`).classList.remove("progress-done-animation");
    }
}