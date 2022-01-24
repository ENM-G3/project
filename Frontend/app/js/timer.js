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
                this.slides[i].classList.add('hidden-slide');
            } else {
                this.slides[i].classList.remove('hidden-slide');
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
            this.removeAnimations();
        }

        this.changeOrder();
        this.app.randomFacts();
    }

    slideIndicator() {
        document.querySelector(`#progress-${this.last} #progress-show`).classList.remove("progress-show");
        document.querySelector(`#progress-${this.current} #progress-done`).classList.add("progress-done-animation");
    }

    removeAnimations() {
        for (const order of this.order) {
            document.querySelector(`#progress-${order} #progress-done`).classList.remove("progress-done-animation");
        }
    }

    isQuestion() {
        document.querySelector(`#progress-${this.current} #progress-show`).classList.add("progress-show");
    }

    getTemplate() {
        let div = document.createElement('div');
        div.classList.add('slide');

        return div;
    }

    async getSlide1() {
        let temp = this.getTemplate();
        temp.id = 'slide1';

        let text = await (await this.get('./js/slides/slide1.html')).text();
        temp.innerHTML = text;

        return temp;
    }

    async getSlide2() {
        let temp = this.getTemplate();
        temp.id = 'slide2';

        let text = await (await this.get('./js/slides/slide2.html')).text();
        temp.innerHTML = text;

        return temp;
    }

    async getSlide3() {
        let temp = this.getTemplate();
        temp.id = 'slide3';

        let text = await (await this.get('./js/slides/slide3.html')).text();
        temp.innerHTML = text;

        temp = await this.addQuestion(temp);

        return temp;
    }

    async getSlides() {
        let slide1 = await this.getSlide1();
        let slide2 = await this.getSlide2();
        let slide3 = await this.getSlide3();

        document.querySelector(".slider").appendChild(slide2);
        document.querySelector(".slider").appendChild(slide1);
        document.querySelector(".slider").appendChild(slide3);

        let chart1 = await this.app.charts.getWatthourAverage("Duiktank", "1d", "TotaalNet", "1h");
        chart1.render();

        let chart = await this.app.charts.getDayNightChart('Duiktank', '1mo', 'TotaalNet');
        chart.render();

        this.app.charts.getRealtimeChart();
        this.app.charts.realtimeChart.render();
    }


    async addQuestion(template) {
        let q = await this.app.randomQuestion();

        template.querySelector('.question-text').innerText = q.question;


        let count = 0;
        for (const option in q.options) {
            count++;
        }
        
        let options_amount = count;
        document.documentElement.style.setProperty('--global-questions-options', options_amount);

        let optionsContainer = template.querySelector('.question-options');

        
        let correct = q.answer;


        for (const option in q.options) {
            if (q.options[option] == true) q.options[option] = 'Waar'; else if (q.options[option] == false) q.options[option] = 'Niet waar';

            let o = document.createElement('div');
            o.classList.add('option');

            if (option == correct) {
                o.classList.add('correct');
            } else {
                o.classList.add('incorrect');
            }

            let img = document.createElement('img');

            let p = document.createElement('p');
            p.innerText = q.options[option];

            o.appendChild(img);
            o.appendChild(p);
            optionsContainer.appendChild(o);

        }

        return template;
    }
}