import * as C from './lib/chart.min.js';

export default class Graphs {
    constructor (app) {
        this.app = app;

        
        this.charts = {
            slide1: {
                allAverage: null,
            },
            slide2: {
                realtime: null,
                daynight: null,
            },
            slide3: {
                realtime: null,
                daynight: null,
            }
            
            
        }

        this.init();

    }

    async init() {
        //await this.getDayNightChart();
    }

    async getAllAveragesChart() {
        let chartContainer = document.querySelector('#slide-1 #graph-bl');
        let ctx = chartContainer.getContext('2d');
        let labels = [], dataset = [];

        for (const device in this.app.devices) {
            labels.push(device);
            let average = await this.app.api.average.get( this.app.devices[device], '1w');

            let watt_hours = average.data[0]._value / 1000 * 168;
            let families = watt_hours / 58;
            dataset.push(families);
        }

        //let highestToLowest = data.sort((a, b) => b - a);

        if (this.charts.slide1.allAverage != null) {
            this.charts.slide1.allAverage.destroy();
        }

        this.charts.slide1.allAverage = new Chart( ctx , {
            type: 'bar',
            height: '100%',
            data: {
                labels,
                datasets: [{
                    data: dataset,
                    backgroundColor: [
                        'rgba(109, 207, 246, 0.2)',
                        'rgba(237, 25, 58, 0.2)',
                        'rgba(128, 130, 133, 0.2)',
                    ],
                    borderColor: [
                        'rgba(109, 207, 246, 1)',
                        'rgba(237, 25, 58, 1)',
                        'rgba(128, 130, 133, 1)',
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            font: function(context) {
                                var width = context.chart.width;
                                var size = Math.round(width / 42);
                                return {
                                    size: size
                                };
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: function(context) {
                                var width = context.chart.width;
                                var size = Math.round(width / 42);
                                return {
                                    size: size
                                };
                            }
                        },
                        title: {
                            display: true,
                            text: 'Gezinnen',
                            font: function(context) {
                                var width = context.chart.width;
                                var size = Math.round(width / 48);
                                return {
                                    size: size,
                                    weight: 600
                                };
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Verbruik vergeleken met het aantal gemiddelde gezinnen.',
                        font: function(context) {
                            var width = context.chart.width;
                            var size = Math.round(width / 42);
                            return {
                                size: size,
                                weight: 600
                            };
                        }
                    }
                }
            }
        })
    }

    async updateAllAveragesChart() {
        //get data

        let labels = [], dataset = [];

        for (const device in this.app.devices) {
            labels.push(device);
            let average = await this.app.api.average.get( this.app.devices[device], '1d');
            let watt_hours = average.data[0]._value / 1000 * 168;
            let families = watt_hours / 58;
            dataset.push(families);
        }

        this.charts.slide1.allAverage.data.labels = labels;
        this.charts.slide1.allAverage.data.datasets[0].data = dataset;
        this.charts.slide1.allAverage.update();
    }

    async getDayNightChart(slide, location) {
        let container = document.querySelector(`#slide-${slide} .graph`);
        let chartContainer = document.querySelector(`#slide-${slide} #graph-bl`);
        let p = document.querySelector(`#slide-${slide} #graph-average p`);

        let data = {
            labels: [],
            datasets: [{
                label: 'Dataset 1',
                data: [],
                backgroundColor: [
                    'rgba(237, 25, 58, 0.2)',
                    'rgba(128, 130, 133, 0.2)',
                ],
                borderColor: [
                    'rgba(237, 25, 58, 1)',
                    'rgba(128, 130, 133, 1)',
                ],
                borderWidth: 2,
            }],
        }

        
        let daynight = await this.app.api.daynight.get(this.app.devices[location], '1d');
        let total = 0;
        let total_day = 0;

        for (let i = daynight.data.length - 1; i >= 0; i--) {
            const element = daynight.data[i];
            data.datasets[0].data.push(element._value);
            total += element._value;
            if (element.day) { 
                data.labels.push('Dag');
                total_day += element._value;
            } else {
                data.labels.push('Nacht');
            }
        }

        total = Math.round(total);
        let percentage_day = Math.round(total_day / total * 100);
        let text = `De ${location} verbruikt overdag gemiddeld ${percentage_day}% van de ${total}kW die dagelijks verbruikt wordt.`;
        p.innerHTML = text;

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                maintainAspectRatio: false,
                responsive: true,
                radius: '90%',
                cutout: '50%',
                plugins: {
                    legend: {
                        display: false,
                    },
                }
            },
        };
        

        if (this.charts[`slide${slide}`].daynight != null) {
            this.charts[`slide${slide}`].daynight.destroy();
        }
        this.charts[`slide${slide}`].daynight = new Chart( chartContainer , config );
    }

    async getRealtimeChart(slide, location, value, max) {
        this.charts[`slide${slide}`].realtime = null;

        let chartContainer = document.querySelector(`#slide-${slide} #graph-br`);
        let realtime = document.querySelector(`#slide-${slide} #graph-realtime`);
        let p = document.querySelector(`#slide-${slide} #graph-text`);

        let percentage = value / max * 100;
        let maxPercentage = 100 - percentage;

        realtime.innerHTML = `${Math.round(percentage)}%`;
        let text = `De site gebruikt op dit moment ${Math.round(max)}kW, waarvan de ${location} ${Math.round(value)}kW gebruikt.<br> Dit is ${Math.round(percentage)}% van het totale verbruik`;
        p.innerHTML = text;



        const config = {
            type: 'doughnut',
            data: {
                labels: [`${location}: ${value}`],
                datasets: [{
                    label: `Huidige waarde ${location}`,
                    data: [percentage, maxPercentage],
                    backgroundColor: [
                        'rgba(109, 207, 246, 0.4)',
                        'rgba(128, 130, 133, 0.4)',
                    ],
                    borderColor: [
                        'rgba(109, 207, 246, 1)',
                        'rgba(128, 130, 133, 1)',
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                radius: '90%',
                cutout: '50%',
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
          };
        

        if (this.charts[`slide${slide}`].realtime != null) {
            this.charts[`slide${slide}`].realtime.destroy();
        }
        this.charts[`slide${slide}`].realtime = new Chart( chartContainer , config );
    }

    async updateRealtimeChart(slide, location, value, max) {
        let percentage = value / max * 100;
        let maxPercentage = 100 - percentage;

        this.charts[`slide${slide}`].realtime.data.datasets[0].data = [percentage, maxPercentage];
        this.charts[`slide${slide}`].realtime.update();
    }

    
}