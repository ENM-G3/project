import * as C from './lib/chart.min.js';

export default class Graphs {

    constructor (app) {
        this.app = app;

        
        this.charts = {
            slide1: {
                allAverage: null,
            },
            slide2: {
                dayNightDuiktank: null,
            }
            
            
        }

        this.init();

    }

    async init() {
        

        //await this.getDayNightChart();
    }

    async getAllAveragesChart() {
        let chartContainer1 = document.querySelector('#slide1-lb-chart');
        let ctx = chartContainer1.getContext('2d');
        let labels = [], dataset = [];

        for (const device in this.app.devices) {
            labels.push(device);
            let average = await this.app.api.average.get( this.app.devices[device], '1w');
            dataset.push(average.data[0]._value);
        }

        //let highestToLowest = data.sort((a, b) => b - a);

        if (this.charts.allAverage != null) {
            this.charts.allAverage.destroy();
        }

        this.charts.allAverage = new Chart( ctx , {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Gemiddeld verbruik op 1 week',
                    data: dataset,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }

    async getAllRealtimeChart() {
        let chartContainer1 = document.querySelector('#slide1-lb-chart');
        let ctx = chartContainer1.getContext('2d');

        let data = {
            labels: [],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                }
                
            ]
        };

        for (const device in this.app.devices) {
            labels.push(device);
            let average = await this.app.api.average.get( this.app.devices[device], '1w');
            dataset.push(average.data[0]._value);
        }

        //let highestToLowest = data.sort((a, b) => b - a);

        if (this.charts.allAverage != null) {
            this.charts.allAverage.destroy();
        }

        this.charts.allAverage = new Chart( ctx , {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Gemiddeld verbruik op 1 week',
                    data: dataset,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }

    async getDayNightChart() {
        
        let chartContainer2 = document.querySelector('#slide-2 #slide2-lb-chart');
        let ctx = chartContainer2.getContext('2d');

        let data = {
            labels: [],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                }
                
            ]
        }

        
        let daynight = await this.app.api.daynight.get(this.app.devices['Duiktank'], '1w');

        for (let i = 0; i < daynight.data.length; i++) {
            const element = daynight.data[i];
            data.datasets[0].data.push(element._value);
            

            if(element.day) data.labels.push('Dag'); else data.labels.push('Nacht');
            
        }


        const config = {
            type: 'doughnut',
            data: data,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'center',
                },
                title: {
                  display: true,
                  text: 'Dag en nacht'
                }
              }
            },
          };
        

        if (this.charts.dayNightDuiktank != null) {
            this.charts.dayNightDuiktank.destroy();
        }
        this.charts.dayNightDuiktank = new Chart( ctx , config );
    }

    
}