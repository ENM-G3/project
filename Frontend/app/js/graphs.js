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

    labels() {
        var width = context.chart.width;
        var size = Math.round(width / 42);
        return size;
    }

    async getAllAveragesChart() {
        let chartContainer1 = document.querySelector('#slide-1 .graph #graph-bl');
        let ctx = chartContainer1.getContext('2d');
        let labels = [], dataset = [];

        for (const device in this.app.devices) {
            labels.push(device);
            let average = await this.app.api.average.get( this.app.devices[device], '1w');
            console.log(average.data[0]._value);
            // dataset.push(average.data[0]._value);

            let wattHours = average.data[0]._value / 1000 * 168;
            let families = wattHours / 58;
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
                    // label: 'Gemiddeld verbruik op 1 week van belangrijkste locaties',
                    label: 'Verbruik tegenover het aantal gezinnen.',
                    data: dataset,
                    backgroundColor: [
                        // 'rgba(255, 99, 132, 0.2)',
                        // 'rgba(54, 162, 235, 0.2)',
                        // 'rgba(255, 206, 86, 0.2)',
                        // 'rgba(75, 192, 192, 0.2)',
                        // 'rgba(153, 102, 255, 0.2)',
                        'rgba(109, 207, 246, 0.2)',
                        'rgba(237, 25, 58, 0.2)',
                        'rgba(128, 130, 133, 0.2)',
                        'rgba(87, 87, 90, 0.2)',
                        'rgba(170, 224, 249, 0.2)',
                    ],
                    borderColor: [
                        // 'rgba(255, 99, 132, 1)',
                        // 'rgba(54, 162, 235, 1)',
                        // 'rgba(255, 206, 86, 1)',
                        // 'rgba(75, 192, 192, 1)',
                        // 'rgba(153, 102, 255, 1)',
                        'rgba(109, 207, 246, 1)',
                        'rgba(237, 25, 58, 1)',
                        'rgba(128, 130, 133, 1)',
                        'rgba(87, 87, 90, 1)',
                        'rgba(170, 224, 249, 1)',
                    ],
                    borderWidth: 1
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
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: function(context) {
                                var width = context.chart.width;
                                var size = Math.round(width / 42);
                                return {
                                    size: size,
                                    weight: 600
                                };
                            }
                       }
                    },
                    datalabels: {
                        font: function(context) {
                            var width = context.chart.width;
                            var size = Math.round(width / 32);
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
            dataset.push(average.data[0]._value);
        }

        this.charts.slide1.allAverage.data.labels = labels;
        this.charts.slide1.allAverage.data.datasets[0].data = dataset;
        this.charts.slide1.allAverage.update();
    }

    async getDayNightChart(slide, location) {
        
        let chartContainer2 = document.querySelector(`#slide-${slide} #lb-chart`);
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

        
        let daynight = await this.app.api.daynight.get(this.app.devices[location], '1d');

        for (let i = 0; i < daynight.data.length; i++) {
            const element = daynight.data[i];
            data.datasets[0].data.push(element._value);
            

            if(element.day) data.labels.push('Dag'); else data.labels.push('Nacht');
            
        }


        const config = {
            type: 'doughnut',
            data: data,
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    rotation: 180,
                    legend: {
                        position: 'left',
                        align: 'center',
                        labels: {
                            font: function(context) {
                                var width = context.chart.width;
                                var size = Math.round(width / 42);
                                return {
                                    size: size
                                };
                            }
                       }
                    },
                    title: {
                        display: true,
                        text: 'Dag en nacht verbruik'
                    },
                    datalabels: {
                        font: function(context) {
                            var width = context.chart.width;
                            var size = Math.round(width / 32);
                            return {
                                size: size,
                                weight: 600
                            };
                        }
                    }
                }
            },
        };
        

        if (this.charts[`slide${slide}`].daynight != null) {
            this.charts[`slide${slide}`].daynight.destroy();
        }
        this.charts[`slide${slide}`].daynight = new Chart( ctx , config );
    }

    async getRealtimeChart(slide, location, value, max) {
        this.charts[`slide${slide}`].realtime = null;

        let chartContainer = document.querySelector(`#slide-${slide} #rb-chart`);

        let percentage = value / max * 100;
        let maxPercentage = 100 - percentage;

        const config = {
            type: 'doughnut',
            data: {
                labels: [`${location}: ${value}`],
                datasets: [{
                    label: `Huidige waarde ${location}`,
                    data: [percentage, maxPercentage],
                    backgroundColor: [
                       '#ed193a',
                       'rgba(200, 200, 200, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'center',
                    },
                    title: {
                        display: true,
                        text: 'Huidige waarde t.o.v. totaal verbruik van site'
                    },
                    tooltip: {
                        enabled: true
                    },
                    datalabels: {
                        font: function(context) {
                            var width = context.chart.width;
                            var size = Math.round(width / 32);
                            return {
                                size: size,
                                weight: 600
                            };
                        }
                    }
                },
                cutout: '80%'
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