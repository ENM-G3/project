

export default class Randomizer {
    constructor () {
        this.last = 0;
    }
    

    getRandomNumberWithLast (max) {    
        let value;

        value = Math.floor(Math.random() * max);

        while (this.last == value) {
            value = Math.floor(Math.random() * max);
        }

        this.last = value;
        return value;
    }

    getRandomNumber (max) {    
        let value;

        value = Math.floor(Math.random() * max);

        return value;
    }


}