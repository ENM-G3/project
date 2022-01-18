import * as SocketIO from './lib/socket.io.min.js';
import * as AC from './lib/apexcharts.min.js';
import Socket from './SOCKET/index.js';
import API from './API/index.js';
import Timer from './timer.js';


export default class App {
    _hostname = "localhost:5001";
    //_socketio = io(this.hostname);
    //_socket = new Socket(this);
    _api = new API(this);
    _timer = new Timer();

    constructor() {
        this.init();
    }

    // get socketio() {
    //     return this._socketio;
    // }

    // get socket() {
    //     return this._socket;
    // }

    get api() {
        return this._api;
    }

    async init() {

        // hier komen de listeners, structuur nog uit te zoeken
        console.log("App has been initialized!");
        let watthours = await this.api.history.get("Duiktank", "1d", "TotaalNet", "1h");
        console.log(watthours);

        let data = [], labels = [];

        for (const hour of watthours.data) {
            data.push(Math.round(hour._value));
            labels.push(hour._time);
        }

        let myChart = new ApexCharts(document.querySelector("#test"), {
            chart: {
              type: 'area',
            },
            dataLabels: {
                enabled: false
            },
            labels,
            series: [{
              data
            }],
            yaxis: {
              opposite: true,
            }
          })
          myChart.render();
        
    }

    domReady(e) {
        this.body = document.body;
    }
    
}