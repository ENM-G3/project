

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
        console.log(`Time since last data: ${Math.round(timeDiff)}`);
    }

    addHandlers() {
        this.socketio.on('B2F_realtime', this.handleRealtime.bind(this));
        this.socketio.on('B2F_connected', this.handleConnect.bind(this));
    }

    handleRealtime(data) {
        this.endElapsed();
        console.log(data);
        this.startElapsed();
    }

    async handleConnect(data){
        this.endElapsed();

        document.documentElement.style.setProperty('--global-progress-duration', `${data.timer}s`);
        this.app.timer.interval = parseInt(data.timer);
        this.app.devices = data.devices;

        console.log(data);

        await this.app.waitForLoad();

        this.startElapsed();
    }



}