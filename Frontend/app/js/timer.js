import Data from './util/Data.js';


export default class Timer {
    constructor(app) {
        this.app = app;
        this.interval = 2;

        

        
        this.order = [];
        Object.assign(this, Data);
    }


    async init() {
        document.documentElement.style.setProperty('--global-progress-duration', `${this.interval}s`);
        
        await this.getSlides();

        this.slider = document.querySelector(".slider");
        this.slides = document.querySelectorAll(".slide");

        this.num_items = this.slides.length;

        document.documentElement.style.setProperty('--global-slides-amount', this.num_items);

        let progressContainer = document.querySelector('div.progress-container');

        for (let i = 1; i <= this.num_items; i++) {
            this.order.push(i);

            let progress = `<div id="progress-${i}" class="progress">
            <div id="progress-base" class="progress-base"></div>
            <div id="progress-done" class="progress-done"></div>
            <div id="progress-show"></div>
            </div>`;

            progressContainer.innerHTML += progress;
            
        }

        this.current = 1;
        this.last = this.num_items;
        
        this.slides.forEach((element, index) => {
            element.style.order = this.order[index];
        });

        this.addEvents();

        this.slideIndicator();
        this.startInterval();
    }

    startInterval() {
        setInterval(this.gotoNext.bind(this), this.interval * 1000);
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

        if (this.order[0] == 1) {
            let el = document.querySelector(`#progress-1 .progress-done`);
            el.style.animation = 'none';
            el.offsetHeight; /* trigger reflow */
            el.style.animation = null; 
        }
        this.slideIndicator();

    }

    addEvents() {
        //document.querySelector(".slider").addEventListener('transitionend', this.changeOrder.bind(this));
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

        if (this.order[0] == 1) {
            this.removeIndicatorAnimations();
        }

        this.changeOrder();
        this.app.randomFacts();
    }

    slideIndicator() {
        document.querySelector(`#progress-${this.last} #progress-show`).classList.remove("progress-show");
        document.querySelector(`#progress-${this.current} #progress-done`).classList.add("progress-done-animation");
    }

    removeIndicatorAnimations() {
        for (const order of this.order) {
            document.querySelector(`#progress-${order} #progress-done`).classList.remove("progress-done-animation");
        }
    }




}