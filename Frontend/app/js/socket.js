

export default class SOCKET {

    constructor(app) {
        this.app = app;
        this.socketio = this.app.io;

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
        this.socketio.on('B2F_connected', this.handleConnect.bind(this));
    }

    async handleRealtime(data) {
        this.endElapsed();
        console.log(data);
        let i = 2;


        for (const device in this.app.devices) {
            if (i == 2) {
                if (this.app.graph.charts[`slide${i}`].realtime != null) {
                    await this.app.graph.updateRealtimeChart(i, device, data.data[this.app.devices[device]], data.data['totalPower']);
                } else {
                    await this.app.graph.getRealtimeChart(i, device, data.data[this.app.devices[device]], data.data['totalPower']);
                }
                
            }

            i++;
        }
        //await this.app.graph.getRealtimeChart(2, 'Duiktank', 10, 200);
        this.startElapsed();
    }

    async handleConnect(data){
        this.endElapsed();

        document.documentElement.style.setProperty('--global-progress-duration', `${data.timer}s`);
        this.app.timer.interval = parseInt(data.timer);
        this.app.devices = data.devices;

        await this.app.waitForLoad();

        this.startElapsed();
    }



}