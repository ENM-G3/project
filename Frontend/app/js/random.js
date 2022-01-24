

export default class Randomizer {
    constructor () {
        this.last = 0;
    }
    

    getRandomNumber (max) {    
        let value;

        value = Math.ceil(Math.random() * max);

        while (this.last == value) {
            value = Math.ceil(Math.random() * max);
        }

        this.last = value;
        return value;
    }
}