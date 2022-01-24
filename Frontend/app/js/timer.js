


export default class Timer {
    constructor(app) {
        this.app = app;
        this.interval = 2;

        

        this.init();
        this.order = [];
        
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

        let question = await this.addQuestion();
        section1.appendChild(question);

        temp.appendChild(section1);

        return temp;
    }

    async getSlides() {
        let slide1 = await this.getSlide1();
        let slide2 = await this.getSlide2();
        let slide3 = await this.getSlide3();

        document.querySelector(".slider").appendChild(slide1);
        document.querySelector(".slider").appendChild(slide2);
        document.querySelector(".slider").appendChild(slide3);

        let chart1 = await this.app.charts.getWatthourAverage("Duiktank", "1w", "TotaalNet", "1d");
        chart1.render();

        let chart = await this.app.charts.getDayNightChart('Duiktank', '1mo', 'TotaalNet');
        chart.render();

        this.app.charts.getRealtimeChart();
        this.app.charts.realtimeChart.render();
    }


    async addQuestion() {
        let section_question = document.createElement('div');
        section_question.classList.add('section-question');

        let question_icon = document.createElement('img');
        question_icon.classList.add('question-icon');
        let question_header = document.createElement('h2');
        question_header.classList.add('question-header');
        question_header.innerText = 'Vraag!';
// TODO: Add question text
        let question_text = document.createElement('p');
        question_text.classList.add('question-text');
        question_text.innerText = 'Question';
// END
// TODO: Get amount of options
        let options_amount = 3;
        document.documentElement.style.setProperty('--global-questions-options', options_amount);
// END
        let question_options = document.createElement('div');
        question_options.classList.add('question-options');

        for (let i = 1; i <= options_amount; i++) {
// TODO: Depending if option is correct or incorrect
            let option = document.createElement('div');
            option.classList.add('option');
            // option.classList.add('correct');
            // option.classList.add('incorrect');
// END
            let img = document.createElement('img');
// TODO: Get options from influx
            let p = document.createElement('p');
            p.innerText = 'Option';
// END
            option.appendChild(img);
            option.appendChild(p);
            question_options.appendChild(option);
        }
        
        section_question.appendChild(question_icon);
        section_question.appendChild(question_header);
        section_question.appendChild(question_text);
        section_question.appendChild(question_options);

        return section_question;
    }
}