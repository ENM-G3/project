/*
    Dit is de class die gebruikt wordt voor elke endpoint. Hier zet je alle get, post, put en deletes.
*/

export default class Example {

    constructor(api) {
        this.api = api;
    }

    get base() {
        /*
            Hier zet je de api endpoint (this.api.host + "/whatever/endpoint/je/wilt")
        */
        return this.api.host;
    }

    async getById(id) {

        let url = this.base + `/${id}`;
        console.log(url);

        // this.api.get komt uit de ./js/util/Data.js file
        const res = await this.api.get(url);


        // Als de request ok returned returnen we de data als een object.
        if (res.ok) {
            return (await res.json());
        }

        // Alles hier is al het een error is.
        const errorBody = await res.json();

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