import * as AC from './lib/apexcharts.min.js';

export default class Graphs {

    constructor (app) {
        this.app = app;

        this.days = ['Zon', 'Ma', 'Di', 'Woe', 'Don', 'Vrij', 'Zat'];

        
    }

    init() {
    }

    async getDayNightChart(measurement, timespan, device) {
        let daynight = (await this.app.api.daynight.get(measurement, device, timespan)).data;

        for (const waarde of daynight) {
            if (waarde.day) {
                waarde.dayString = "Dag";
            } else {
                waarde.dayString = "Nacht";
            }
        }

        var options = {
            series: [daynight[0]._value, daynight[1]._value],
            labels: [daynight[0].dayString, daynight[1].dayString],
            chart: {
                height: '100%',
                type: 'donut',
                animations: {
                    enabled: false
                },
            },
            legend: {
                position: 'bottom',
                offsetY: 0,
                height: '12%',
            }

          };

        let chart = new ApexCharts(document.querySelector('.daynightDuiktank1wTotaalNet'), options);
        return chart;
    }

    async getWatthourAverage(measurement, timespan, device, pertime) {

        let watthours = await this.app.api.history.get(measurement, timespan, device, pertime);

        let data = [], labels = [];

        for (const hour of watthours.data) {
            data.push(Math.round(hour._value / 1000));
            let date = new Date(hour._time);

            let hours = date.getHours();
            if (hours < 10) {
                hours = `0${hours}`;
            }

            let minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }

            let hourString = `${hours}:${minutes}`;

            
            let month;


            if(date.getMonth() < 9) {
                month = `0${date.getMonth() + 1}`;
            } else {
                month = `${date.getMonth() + 1}`;
            }
            let dateString = `${this.days[date.getDay()]} ${date.getDate()}/${month}`;
            labels.push(hourString);
        }

        let options = {
            chart: {
                type: 'area',
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false,
                },
                animations: {
                    enabled: false
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
              opposite: false,
            },
            legend: {
                position: 'bottom',
                offsetY: 0,
                height: '20%',
            }
        };

        return new ApexCharts(document.querySelector(".testGraph"), options);
    }

    async getRealtimeChart() {
        var options = {
            series: [],
            chart: {
                height: "100%",
                type: 'donut',
                animations: {
                    enabled: false
                },
            },

            dataLabels: {
                enabled: false
            },

            legend: {
                position: 'bottom',
                offsetY: 0,
                height: '10%',
            }

          };
  
          this.realtimeChart = new ApexCharts(document.querySelector(".realtime"), options);
    }

    async updateRealtimeChart(data) {
        let values = [], labels = [];

        for (const key in data) {
            labels.push(key);
            values.push(data[key]);
        }

        
        this.realtimeChart.updateOptions({
            labels
        });
        this.realtimeChart.updateSeries(values);
    }

    
}