/*
    Dit is de class die gebruikt wordt voor elke endpoint. Hier zet je alle get, post, put en deletes.
*/

export default class Facts {

    constructor(api) {
        this.api = api;

        this.types = ["weetje", "vergelijking", "meerkeuze"];
        
        this.weetjes = [];
        this.vergelijkingen = [];
        this.meerkeuze = [];
    }

    get base() {
        /*
            Hier zet je de api endpoint (this.api.host + "/whatever/endpoint/je/wilt")
        */
        return this.api.host + "/facts";
    }

    async init() {
        this.weetjes = (await this.getByType('weetje')).data;
        this.vergelijkingen = (await this.getByType('vergelijking')).data;
        this.meerkeuze = (await this.getByType('meerkeuze')).data;
    }

    async getByType(type) {
        let url = `${this.base}/${type}`;
        // Type can be 'weetje', 'vergelijking' or 'meerkeuze'
        if (this.types.includes(type)){
            const res = await this.api.get(url);
            if (res.ok) {
                return (await res.json());
            }

            const errorBody = await res.json();
            return errorBody;
        } else {
            return "Invalid type";
        }
    }

    async postByType(type, factObj) {

        // FIXME: fix this function once i know properly what i need to return and send. 

        let url = `${this.base}/${type}`;
        // Type can be 'weetje', 'vergelijking' or 'meerkeuze'
        if (this.types.includes(type)){
            const res = await this.api.post(url, factObj);

            if (res.ok) {
                return (await res.json());
            }

            const errorBody = await res.json();
            return errorBody;
        } else {
            return "Invalid type";
        }
    }

    async getById(id) {
        let url = `${this.api.host}/fact/${id}`;

        const res = await this.api.get(url);

        if (res.ok) {
            return (await res.json());
        }

        const errorBody = await res.json();
        return errorBody;
    }

    async getRandomQuestion() {
        let random =  Math.floor(Math.random() * this.meerkeuze.length);
        return this.meerkeuze[random];
    }

    async getRandomFacts(){

        let returnWeetjes = [];

        let random = Math.floor(Math.random() * this.weetjes.length);
        returnWeetjes.push(this.weetjes[random]);

        let random2 = Math.floor(Math.random() * this.weetjes.length);
        while (random == random2) {
            random2 = Math.floor(Math.random() * this.weetjes.length);
        }
        returnWeetjes.push(this.weetjes[random2]);


        return returnWeetjes;
    }
}