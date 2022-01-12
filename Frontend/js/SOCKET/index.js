

export default class SOCKET {

    constructor(app) {
        this.app = app;
        this.socketio = this.app.socketio;
    }

    message(msg) {
        this.socketio.send(msg);
    }


}