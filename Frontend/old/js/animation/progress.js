

export default class Progress {

    constructor (animation) {
        this.animation = animation;
        this.indicators = this.getSlideIndicators();

        
    }

    getSlideIndicators() {
        let indicators = document.querySelectorAll(".progress");
        let visibleIndicators = [];

        for (const indicator of indicators) {
            if (!indicator.classList.contains('invisible')) {
                visibleIndicators.push(indicator);
            }
        }
        return visibleIndicators;
    }


}