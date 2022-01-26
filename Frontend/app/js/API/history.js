

export default class History {

    constructor(api) {
        this.api = api;
    }

    get base() {
        /*
            Hier zet je de api endpoint (this.api.host + "/whatever/endpoint/je/wilt")
        */
        return this.api.host + "/watthour";
    }

    async get(timespan, device, pertime) {

        let url = this.base + `/${timespan}/${device}/${pertime}`;

        // this.api.get komt uit de ./js/util/Data.js file
        const res = await this.api.get(url);


        // Als de request ok returned returnen we de data als een object.
        if (res.ok) {
            return (await res.json());
        }

        // Alles hier is al het een error is.
        const errorBody = await res.text();

        // En deze error returnen
        return `${res.status} - ${errorBody.status}`;
    }

    async getHistory(device, timespan) {
        let url = this.api.host + "/history" + `/${timespan}/${device}`;

        // this.api.get komt uit de ./js/util/Data.js file
        const res = await this.api.get(url);


        // Als de request ok returned returnen we de data als een object.
        if (res.ok) {
            return (await res.json());
        }

        // Alles hier is al het een error is.
        const errorBody = await res.text();

        // En deze error returnen
        return `${res.status} - ${errorBody.status}`;
    }

    async post(body) {
        // Handle post
    }

    async put(body) {
        // Handle put
    }

}