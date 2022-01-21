

export default class SOCKET {

    constructor(app) {
        this.app = app;
        this.socketio = this.app.socketio;

        this.addHandlers();

        this.realtime = {};
    }

    addHandlers() {
        this.socketio.on('B2F_realtime', this.handleRealtime.bind(this));
    }

    handleRealtime(data) {
        this.app.charts.updateRealtimeChart(data.data);
    }


}