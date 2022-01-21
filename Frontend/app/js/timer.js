


export default class Timer {
    constructor(app) {
        this.app = app;
        this.interval = 2;

        this.order = [1, 2, 3];

        this.init();

        
    }

    async init() {
        document.documentElement.style.setProperty('--global-progress-duration', `${this.interval}s`);
        await this.getSlides();

        this.slider = document.querySelector(".slider");
        this.slides = document.querySelectorAll(".slide");

        this.num_items = this.slides.length;

        
        this.slides.forEach((element, index) => {
            element.style.order = this.order[index];
        });

        this.addEvents();

        this.slideIndicator();
        setInterval(this.gotoNext.bind(this), this.interval * 1000);
    }

    changeOrder() {

        for (let i = 0; i < this.num_items; i++) {
            this.slides[i].style.order = this.order[i];
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
        this.order.push(this.order[0]);
        this.order.shift();

        if (this.order[0] == 1) {
            this.removeAnimations();
        }

        this.changeOrder();
    }

    slideIndicator() {
        document.querySelector(`#progress-${this.order[0]} .progress-done`).classList.add("progress-done-animation");
    }

    removeAnimations() {
        for (const order of this.order) {
            document.querySelector(`#progress-${order} .progress-done`).classList.remove("progress-done-animation");
        }
    }

    getTemplate() {
        let div = document.createElement('div');
        div.classList.add('slide');

        return div;
    }

    async getSlide1() {
        let temp = this.getTemplate();
        temp.id = 'slide1';

        let section1 = document.createElement('section');
        section1.id = 'section1';
        section1.classList.add('grid-top');

        let section2 = document.createElement('section');
        section2.id = 'section1';
        section2.classList.add('grid-bottom');
        section2.classList.add('realtime');

        temp.appendChild(section1);
        temp.appendChild(section2);

        return temp;
    }

    async getSlide2() {
        let temp = this.getTemplate();
        temp.id = 'slide2';

        let section1 = document.createElement('section');

        section1.id = 'section1';

        section1.classList.add('testGraph');
        section1.classList.add('grid-top-left');

        let section2 = document.createElement('section');
        section2.id = 'section2';
        section2.classList.add('daynightDuiktank1wTotaalNet');
        section2.classList.add('grid-bottom-left');

        let section3 = document.createElement('section');
        section3.id = 'section3';
        section3.classList.add('grid-bottom-right');

        let section5 = document.createElement('section');
        section5.id = 'section5';
        section5.classList.add('grid-vertical');


        temp.appendChild(section1);
        temp.appendChild(section2);
        temp.appendChild(section3);

        temp.appendChild(section5);



        return temp;
    }

    async getSlide3() {
        let temp = this.getTemplate();
        temp.id = 'slide3';

        let section1 = document.createElement('section');

        section1.id = 'section1';
        section1.classList.add('grid-top-left');

        temp.appendChild(section1);

        return temp;
    }

    async getSlides() {
        let slide1 = await this.getSlide1();
        let slide2 = await this.getSlide2();
        let slide3 = await this.getSlide3();

        document.querySelector(".slider").appendChild(slide1);
        document.querySelector(".slider").appendChild(slide3);
        document.querySelector(".slider").appendChild(slide2);

        let chart1 = await this.app.charts.getWatthourAverage("Duiktank", "1w", "TotaalNet", "1d");
        chart1.render();

        let chart = await this.app.charts.getDayNightChart('Duiktank', '1mo', 'TotaalNet');
        chart.render();

        this.app.charts.getRealtimeChart();
        this.app.charts.realtimeChart.render();
    }



}