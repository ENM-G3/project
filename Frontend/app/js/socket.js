

export default class SOCKET {

    constructor(app) {
        this.app = app;
        this.socketio = this.app.io;

        this.first = false;
        
        
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
                // document.querySelector(`#slide-${i} .realtime-text-container #value`).innerText = Math.round(data.data[this.app.devices[device]] / 100) / 10;
            }
            i++;
        }
        this.startElapsed();
    }


    async handleConnect(data) {
        if (this.first) {
            await this.handleUpdate(data);
        } else {
            await this.handleFirstConnect(data);
        }
    }

    async handleUpdate(data) {
        window.location.reload();
        await this.handleFirstConnect(data);
    }

    async handleFirstConnect(data){
        this.first = true;
        this.endElapsed();

        document.documentElement.style.setProperty('--global-progress-duration', `${data.timer}s`);
        this.app.timer.interval = parseInt(data.timer);
        this.app.devices = data.devices;

        await this.app.waitForLoad();

        this.startElapsed();
    }



}