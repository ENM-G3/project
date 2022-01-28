

export default class SOCKET {

    constructor(app) {
        this.app = app;
        this.socketio = this.app.io;

        
        this.socketio.on('B2F_connected', this.handleConnect.bind(this));
    }

    init() {
        this.startElapsed();
        this.addHandlers();
    }

    startElapsed() {
        this.start = performance.now();
    }

    endElapsed() {
        this.end = performance.now();

        var timeDiff = this.end - this.start;

        //timeDiff /= 1000;
        //console.log(`Time since last data: ${Math.round(timeDiff)}`);
    }

    addHandlers() {
        this.socketio.on('B2F_realtime', this.handleRealtime.bind(this));
    }

    async handleRealtime(data) {
        this.endElapsed();
        let i = 2;


        for (const device in this.app.devices) {
            if (i == 2 || i == 3) {
                if (this.app.graph.charts[`slide${i}`].realtime != null) {
                    await this.app.graph.updateRealtimeChart(i, device, data.data[this.app.devices[device]], data.data['totalPower']);
                } else {
                    await this.app.graph.getRealtimeChart(i, device, data.data[this.app.devices[device]], data.data['totalPower']);
                }

                let random =  Math.floor(Math.random() * this.app.api.facts.vergelijkingen.length);

                let watthours = data.data[this.app.devices[device]] * 1;

                let value = this.app.api.facts.vergelijkingen[random].time / 60;
                let powerOverOneHour = this.app.api.facts.vergelijkingen[random].amount / value;
                let timesVergelijkingInRealtime =  watthours / powerOverOneHour;

                //console.log(data.data[this.app.devices[device]],this.app.api.facts.vergelijkingen[random].amount, this.app.api.facts.vergelijkingen[random].time, value, powerOverOneHour, timeRealtimeInPowerOverOneHour, device, this.app.api.facts.vergelijkingen[random].name )
                if (timesVergelijkingInRealtime < 1) {
                    timesVergelijkingInRealtime = powerOverOneHour / watthours;
                    document.querySelector(`#slide-${i} .vergelijking`).innerText = `${device} kan ${Math.round(timesVergelijkingInRealtime)} in ${this.app.api.facts.vergelijkingen[random].name}`;
                } else {
                    document.querySelector(`#slide-${i} .vergelijking`).innerText = `${this.app.api.facts.vergelijkingen[random].name} kan ${Math.round(timesVergelijkingInRealtime)} in ${device}`;
                }
            }

            i++;
        }
        //await this.app.graph.getRealtimeChart(2, 'Duiktank', 10, 200);
        this.startElapsed();
    }

    async handleConnect(data){
        this.endElapsed();
        console.log(data);

        document.documentElement.style.setProperty('--global-progress-duration', `${data.timer}s`);
        this.app.timer.interval = parseInt(data.timer);
        this.app.devices = data.devices;

        await this.app.waitForLoad();

        this.startElapsed();
    }



}