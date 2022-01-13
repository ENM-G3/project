from repositories.InfluxRepository import InfluxRepository
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
import time
import threading
import configparser


config = configparser.ConfigParser()
config.read('Backend\config.ini')

app = Flask(__name__)
app.config['SECRET_KEY'] = config['app']['key']

socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)


# Custom endpoint
endpoint = '/api/v1'
# API ENDPOINTS


@app.route('/')
def hello():
    return "Server is running."


@app.route(endpoint + '/Test', methods=['GET'])
def get_history():
    if request.method == 'GET':
        return jsonify(data=InfluxRepository.read_all_net_day()), 200

# SOCKET IO


@socketio.on('connect')
def connect():
    print('A new client connects')


# RUN
if __name__ == '__main__':
    socketio.run(app, debug=False, host='0.0.0.0')  # default port is 5000
