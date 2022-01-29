import * as SocketIO from './lib/socket.io.min.js';
import API from './API/index.js';
import Timer from './timer.js';
import Graphs from './graphs.js';
import Socket from './socket.js';


export default class App {


    constructor() {
        this.hostname = "enmg3backend.westeurope.azurecontainer.io:5000";
        
        this.io = io(this.hostname);
        
        this.api = new API(this);
        this.timer = new Timer(this);
        this.graph = new Graphs(this);
        this.socket = new Socket(this);

        this.init();
    }


    async init() {

        // hier komen de listeners, structuur nog uit te zoeken
        
        
        //this.removeLoader();

    }


    // function for starting async functions to see if all elements are loaded.
    async waitForLoad() {
        try {
            
            await this.graph.getDayNightChart(2, 'Duiktank');
            await this.graph.getDayNightChart(3, 'Fuifzaal');
            await this.graph.getAllAveragesChart();

            
            await this.api.facts.init();
            this.socket.init();
            this.fillWeetjes(1, 'general');
            this.fillWeetjes(1, 'general', 2);

            this.fillQuestion(2, await this.api.facts.getRandomQuestion());
            this.fillWeetjes(2, 'Duiktank');

            this.fillQuestion(3, await this.api.facts.getRandomQuestion());
            this.fillWeetjes(3, 'Fuifzaal');

            this.fillVergelijking(2, 'Duiktank');
            this.fillVergelijking(3, 'Fuifzaal');
            await this.timer.init();
            
            return true;
        } catch(e) {
            throw e;
        } finally {
            this.removeSpinner();
        }
    }

    removeSpinner() {
        document.querySelector('.spinning-loader').classList.add('invisible');
    }
    
    fillQuestion(slideNumber, question) {
        let correct = question.answer;
        let optionsContainer = document.querySelector(`#slide-${slideNumber} .question-options`);
        
        optionsContainer.innerHTML = "";
        let questionText = document.querySelector(`#slide-${slideNumber} #question-statement`);

        questionText.innerHTML = question.question;

        let count = 1;

        for (const option in question.options) {
            if (question.options[option] == true) {
                question.options[option] = 'Waar';
            } else if (question.options[option] == false) {
                question.options[option] = 'Niet waar';
            }
            let correctIncorrect = '';
            if (correct == option) {
                correctIncorrect = 'correct';
            } else {
                correctIncorrect = 'incorrect';
            }

            optionsContainer.innerHTML += `            
            <div id="question-option-${count}" class="question-option ${correctIncorrect}">
                <img>
                <p>${question.options[option]}</p>
            </div>`;
            count++;
        }
        
        document.documentElement.style.setProperty('--js-question-options', count);
    }

    fillWeetjes(slideNumber, locatie, weetjeNummer = 1) {
        let locatieWeetjes = [];
        for (const weetje of this.api.facts.weetjes) {
            if ( weetje.location == locatie) {
                locatieWeetjes.push(weetje);
            }
        }
        if (locatieWeetjes.length == 0) {
            this.fillWeetjes(slideNumber, 'general', weetjeNummer);
        } else {
            const random = Math.floor(Math.random() * locatieWeetjes.length);
            document.querySelector(`#slide-${slideNumber} #weetje-${weetjeNummer}`).innerHTML = locatieWeetjes[random].fact;
        }

    }

    async fillVergelijking(slideNumber, device) {
        // zoeken naar best geschikte vergelijking.
        

        let average = (await this.api.average.get( this.devices[device], '1w')).data[0]._value;
        let timesVergelijkingInRealtime;

        let i = 0;
        let dichtste = {
            index: 0,
            laagsteWaarde: 0,
            uitkomst: 0
        };
        for (const vergelijking of this.api.facts.vergelijkingen) {

            timesVergelijkingInRealtime =  average / vergelijking.amount;
            let rounded = Math.round(timesVergelijkingInRealtime);
            let abs = Math.abs(rounded - timesVergelijkingInRealtime);

            if (i == 0) {
                dichtste.index = i;
                dichtste.laagsteWaarde = abs;
                dichtste.uitkomst = timesVergelijkingInRealtime;
            } else if (dichtste.laagsteWaarde > abs && average > vergelijking.amount) {
                dichtste.index = i;
                dichtste.laagsteWaarde = abs;
                dichtste.uitkomst = timesVergelijkingInRealtime;
            }

            i++;
        }
        let randomWeetje = this.api.facts.vergelijkingen[dichtste.index];

        let string;
        if (dichtste.uitkomst < 1) {
            dichtste.uitkomst =  randomWeetje.amount / average;
            string = `${device} verbruikte in de voorbije ${Math.round(dichtste.uitkomst)} uur evenveel als een ${randomWeetje.name} op ${randomWeetje.time}`;

        } else {
            if ( Math.round(dichtste.uitkomst) > 1) {
                // meervoud
                string = `${device} verbruikte in het voorbije uur evenveel als ${Math.round(dichtste.uitkomst)} ${randomWeetje.names} op ${randomWeetje.time}`;
            } else {
                // enkelvoud
                string = `${device} verbruikte in het voorbije uur evenveel als ${Math.round(dichtste.uitkomst)} keer een ${randomWeetje.name} op ${randomWeetje.time}`;
            }
            
        }
        document.querySelector(`#slide-${slideNumber} #weetje-2`).innerHTML = string;

        
    }

    async updateData() {
        await this.graph.updateAllAveragesChart();

        await this.api.facts.init();

        this.fillWeetjes(1, await this.api.facts.getRandomFacts());
        this.fillQuestion(2, await this.api.facts.getRandomQuestion());
        this.fillWeetjes(2, await this.api.facts.getRandomFacts());

        this.fillQuestion(3, await this.api.facts.getRandomQuestion());
        this.fillWeetjes(3, await this.api.facts.getRandomFacts());
    }



    domReady(e) {
        this.body = document.body;
    }
    
}