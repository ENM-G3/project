

export default class Timer {
    constructor() {
        this.interval = 5;
        this.slider = document.querySelector(".slider");
        this.slides = document.querySelectorAll(".slide");
        this.num_items = this.slides.length;

        this.current = 1;
        console.log(this.slider);
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

        for(let i = 1; i < (this.num_items + 1); i++) {
            orderList.push(this.slides[i - 1].style.order);
		}
        console.log(orderList);

        // for(let i = this.current; i <= this.num_items; i++) {
        //     if (i == this.num_items) {
        //         this.slides[i - 1].style.order = order;
        //         order++;
        //     } else {
        //         this.slides[i].style.order = order;
        //         order++;
        //     }
        //     console.log(i);
        //     try {

        //     } catch(e) {
        //         console.log(e, i)
        //     }

		// }

        // for (let i = 1; i < this.current; i++) {
        //     this.slides[i].style.order = order;
        //     order++;
        // }

        // document.querySelector(".slider").classList.remove('slider-transition');
		// document.querySelector(".slider").style.transform = 'translateX(0)';

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


}