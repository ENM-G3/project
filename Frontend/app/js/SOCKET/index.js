

export default class SOCKET {

    constructor(app) {
        this.app = app;
        this.socketio = this.app.socketio;
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
        console.log(`Time since last realtime: ${Math.round(timeDiff)}`);
    }

    addHandlers() {
        this.socketio.on('B2F_realtime', this.handleRealtime.bind(this));
    }

    handleRealtime(data) {
        this.endElapsed();
        this.app.charts.updateRealtimeChart(data.data);
        this.startElapsed();
    }


}