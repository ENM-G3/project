import * as SocketIO from './lib/socket.io.min.js';
import * as AC from './lib/apexcharts.min.js';
import Socket from './SOCKET/index.js';
import API from './API/index.js';
import Timer from './timer.js';
import Graphs from './graphs.js';


export default class App {
    _hostname = "localhost:5001";
    //_socketio = io(this.hostname);
    //_socket = new Socket(this);
    _api = new API(this);
    _timer = new Timer(this);
    _graph = new Graphs(this);

    constructor() {
        this.init();

        Object.assign(this, ApexCharts);
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

    get graphs() {
      return this._graph;
    }

    async init() {

        // hier komen de listeners, structuur nog uit te zoeken
        console.log("App has been initialized!");
        let watthours = await this.api.history.get("Duiktank", "1w", "TotaalNet", "1d");
        console.log(watthours);

        let data = [], labels = [];

        for (const hour of watthours.data) {
            data.push(Math.round(hour._value / 1000));

            let date = new Date(hour._time);
            let hours = date.getHours();
            let minutes = date.getMinutes();

            if (hours < 10) {
              hours = `0${hours}`;
            }

            if (minutes < 10) {
              minutes = `0${minutes}`;
            }

            labels.push(`${hours}:${minutes}`);
        }

        let myChart = new ApexCharts(document.querySelector(".testGraph"), {
            chart: {
              type: 'area',
              zoom: {
                enabled: false
              },
              toolbar: {
                show: false,
              }
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