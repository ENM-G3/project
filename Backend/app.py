from repositories.InfluxRepository import InfluxRepository
from repositories.MqttDatabase import MqttDatabase
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


@app.route(endpoint + '/history/<measurement>/<timespan>', methods=['GET'])
def get_history(measurement, timespan):
    if request.method == 'GET':
        data = InfluxRepository.read_data(measurement, timespan)
        return jsonify(data=data), 200


@app.route(endpoint + '/history/<measurement>/<timespan>/<device>', methods=['GET'])
def get_history_device(measurement, timespan, device):
    if request.method == 'GET':
        data = InfluxRepository.read_data_from_device(
            measurement, timespan, device)
        return jsonify(data=data), 200


# example http://localhost:5000/api/v1/watthour/Duiktank/1w/TotaalNet/1d
@app.route(endpoint + '/watthour/<measurement>/<timespan>/<device>/<pertime>', methods=['GET'])
def get_watthour_device(measurement, timespan, device, pertime):
    if request.method == 'GET':
        data = InfluxRepository.read_watthour_from_device(
            measurement, timespan, device, pertime)
        return jsonify(data=data), 200

# @app.route(endpoint + '/<device>/<timespan>', methods=['GET'])
# def get_history(device, timespan):
#     if request.method == 'GET':
#         function = "InfluxRepository.read_all_" + device + "_" + timespan + "()"
#         return jsonify(data=eval(function)), 200


@ app.route(endpoint + '/TEST', methods=['GET'])
def get_data():
    if request.method == 'GET':
        return MqttDatabase.open_mqtt_connection(), 200

# SOCKET IO


@ socketio.on('connect')
def connect():
    print('A new client connects')


# RUN
if __name__ == '__main__':
    socketio.run(app, debug=False, host='0.0.0.0')  # default port is 5000
