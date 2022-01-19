import * as AC from './lib/apexcharts.min.js';

export default class Graphs {

    constructor (app) {
        this.app = app;
    }

    async getDayNightChart() {
        let daynight = (await this.app.api.daynight.get('Duiktank', 'TotaalNet', '1w')).data;

        for (const waarde of daynight) {
            if (waarde.day) {
                waarde.dayString = "Dag";
            } else {
                waarde.dayString = "Nacht";
            }
        }

        let options = {
            series: [daynight[0]._value, daynight[1]._value],
            labels: [daynight[0].dayString, daynight[1].dayString],
            chart: {
            type: 'donut',
            toolbar: false
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 100
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        };

        let chart = new ApexCharts(document.querySelector('.daynightDuiktank1wTotaalNet'), options);
        return chart;
    }

    
}