


export default class Timer {
    constructor(app) {
        this.app = app;
        this.interval = 2;
        this.slider = document.querySelector(".slider");
        this.slides = document.querySelectorAll(".slide");
        this.num_items = this.slides.length;



        this.init();
    }

    async init() {
        await this.getSlides();

        this.current = 1;
        this.slides.forEach((element, index) => {
            console.log(element);
            element.style.order = index + 1;
        });
        this.addEvents();

        this.slideIndicator();
        setInterval(this.gotoNext, this.interval * 1000);
    }

    changeOrder() {

        if (this.current == this.num_items) {
            this.current = 1;
            this.removeAnimations();
        } else {
            this.current++;
        }
        this.slideIndicator();

        let order = 1;
        let orderList = [];

        console.log(this.current);

        for(let i = 1; i < (this.num_items + 1); i++) {
            orderList.push(this.slides[i].style.order);
		}

        for(let i = this.current; i <= this.num_items; i++) {
            if (i == this.num_items) {
                this.slides[i - 1].style.order = order;
                order++;
            } else {
                this.slides[i].style.order = order;
                order++;
            }
            console.log(i);
            try {

            } catch(e) {
                console.log(e, i)
            }

		}

        for (let i = 1; i < this.current; i++) {
            this.slides[i].style.order = order;
            order++;
        }

        document.querySelector(".slider").classList.remove('slider-transition');
		document.querySelector(".slider").style.transform = 'translateX(0)';

    }

    addEvents() {
        document.querySelector(".slider").addEventListener('transitionend', () => {
			this.changeOrder();
		});
    }

    gotoNext () {
		document.querySelector(".slider").classList.add('slider-transition');
		document.querySelector(".slider").style.transform = 'translateX(-100%)';
    }

    slideIndicator() {
        document.querySelector(`#progress-${this.current} .progress-done`).classList.add("progress-done-animation");
    }

    removeAnimations() {
        for (let i = 1; i <= this.num_items; i++) {
            document.querySelector(`#progress-${this.current} .progress-done`).classList.remove("progress-done-animation");
        } 
    }

    async getTemplate() {
        let div = document.createElement('div');
        div.classList.add('slide');

        return div;
    }

    async getSlide1() {
        let temp = await this.getTemplate();
        temp.id = 'slide1';

        let section1 = document.createElement('section');
        section1.id = 'section1';
        section1.classList.add('testGraph');

        let section2 = document.createElement('section');
        section2.id = 'section2';
        section2.classList.add('daynightDuiktank1wTotaalNet');

        



        temp.appendChild(section1);
        temp.appendChild(section2);



        return temp;
    }

    async getSlides() {
        let slide1 = await this.getSlide1();

        document.querySelector(".slider").appendChild(slide1);

        let chart1 = await this.app.charts.getWatthourAverage("Duiktank", "1w", "TotaalNet", "1d");
        chart1.render();

        let chart = await this.app.charts.getDayNightChart('Duiktank', '1mo', 'TotaalNet');
        chart.render();
    }



}