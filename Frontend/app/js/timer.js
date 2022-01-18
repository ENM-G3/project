

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

        setInterval(this.gotoNext, this.interval * 1000);
    }

    changeOrder() {
        console.log(this.num_items, this.current)
        if (this.current == this.num_items) {
            this.current = 1;
        } else {
            this.current++;
        }

        let order = 1;

        for(let i=this.current; i<=this.num_items; i++) {
            
			this.slides[i].style.order = order;
			order++;
		}

        for(let i=1; i<this.current; i++) {
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


}