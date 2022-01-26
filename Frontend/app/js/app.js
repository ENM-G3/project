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
    
        await this.waitForLoad();
        //this.removeLoader();

    }


    // function for starting async functions to see if all elements are loaded.
    async waitForLoad() {
        try {
            await this.api.facts.init();
            this.fillQuestion(await this.api.facts.getRandomQuestion());
            this.fillWeetjes(await this.api.facts.getRandomFacts());
            await this.timer.init();
            
            return true;
        } catch(e) {
            console.log(e);
            throw e;
        }
    }
    
    fillQuestion(question) {
        let correct = question.answer;
        let optionsContainer = document.querySelector('.question-options');
        let questionText = document.querySelector('#question-statement');

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
    }

    fillWeetjes(weetjes) {
        console.log(weetjes);
        document.querySelector('#weetje-1').innerHTML = weetjes[0].fact;
        document.querySelector('#weetje-2').innerHTML = weetjes[1].fact;
    }

    domReady(e) {
        this.body = document.body;
    }
    
}