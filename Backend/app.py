import configparser
import threading
import time
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from flask import Flask, jsonify, request
from repositories.CosmosRepository import CosmosRepository
from repositories.Mqtt import Mqtt
from repositories.InfluxRepository import InfluxRepository
import sys
import datetime
import json

config = configparser.ConfigParser()
config.read(f'{sys.path[0]}/config/config.ini')

app = Flask(__name__)
app.config['SECRET_KEY'] = config['app']['key']

socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# threading


def socketio_run():
    if config.has_option('app', 'port'):
        port = config['app']['port']
    else:
        port = 5000
    socketio.run(app, debug=False, host='0.0.0.0', port=port)


thread1 = threading.Timer(0, socketio_run)
thread2 = threading.Timer(
    0, Mqtt.open_mqtt_connection_realtime, args=(socketio,))
thread1.start()
thread2.start()


# Custom endpoint
endpoint = '/api/v1'
# API ENDPOINTS


@app.route('/')
def hello():
    return "Server is running."


@app.route(endpoint + '/history/<timespan>', methods=['GET'])
def get_history(timespan):
    if request.method == 'GET':
        data = InfluxRepository.read_data(timespan)
        return jsonify(data=data), 200


@app.route(endpoint + '/history/<timespan>/<device>', methods=['GET'])
def get_history_device(timespan, device):
    if request.method == 'GET':
        data = InfluxRepository.read_data_from_device(
            timespan, device)
        return jsonify(data=data), 200


@app.route(endpoint + '/average/<timespan>/<device>', methods=['GET'])
def get_average_device(timespan, device):
    if request.method == 'GET':
        data = InfluxRepository.read_average_watt_from_device(
            timespan, device)
        return jsonify(data=data), 200


@app.route(endpoint + '/total/average/<timespan>', methods=['GET'])
def get_total_average(timespan):
    if request.method == 'GET':
        data = InfluxRepository.read_total_average_watt(
            timespan)
        return jsonify(data=data), 200


# example http://localhost:5000/api/v1/watthour/1w/TotaalNet/1d
@app.route(endpoint + '/watthour/<timespan>/<device>/<pertime>', methods=['GET'])
def get_watthour_device(timespan, device, pertime):
    if request.method == 'GET':
        data = InfluxRepository.read_watthour_from_device(
            timespan, device, pertime)
        return jsonify(data=data), 200


@app.route(endpoint + '/total/watthour/<timespan>/<pertime>', methods=['GET'])
def get_total_watthour(timespan, pertime):
    if request.method == 'GET':
        data = InfluxRepository.read_total_watthour(
            timespan, pertime)
        return jsonify(data=data), 200


@app.route(endpoint + '/daynight/<timespan>/<device>', methods=['GET'])
def get_daynight_device(timespan, device):
    if request.method == 'GET':
        data = InfluxRepository.read_day_night_from_device(
            timespan, device)
        return jsonify(data=data), 200


@app.route(endpoint + '/facts/<typeweetje>', methods=['GET', 'POST'])
def weetjes(typeweetje):
    # type weetje, vergelijking, meerkeuze
    if request.method == 'GET':
        data = CosmosRepository.get_all_weetjes_van_type(typeweetje)
        return jsonify(data=data), 200

    elif request.method == 'POST':
        data = CosmosRepository.json_or_formdata(request)
        if typeweetje == 'weetje':
            result = CosmosRepository.create_weetje(
                data['fact'], data['location'])
            return jsonify(result=result), 201

        elif typeweetje == 'vergelijking':
            result = CosmosRepository.create_vergelijking(
                data['name'], data['names'], data['amount'], data['time'], data['location'])
            return jsonify(result=result), 201

        elif typeweetje == 'meerkeuze':
            result = CosmosRepository.create_meerkeuze(
                data['question'], data['options'], data['answer'], data['location'])
            return jsonify(result=result), 201


@app.route(endpoint + '/fact/<id>', methods=['GET', 'PUT', 'DELETE'])
def weetje(id):
    if request.method == 'GET':
        data = CosmosRepository.get_item_by_id(id)
        return jsonify(data=data), 200

    if request.method == 'PUT':
        data = CosmosRepository.json_or_formdata(request)
        result = CosmosRepository.replace_item(data)
        return jsonify(result=result), 201

    if request.method == 'DELETE':
        result = CosmosRepository.delete_item(id)
        return jsonify(result=result), 201


@app.route(endpoint + '/config', methods=['GET', 'PUT'])
def settings():
    if request.method == 'GET':
        data = get_config()
        return jsonify(data=data)
    elif request.method == 'PUT':
        data = json_or_formdata(request)
        devices = []
        displaynames = []
        for displayname, device in data['devices'].items():
            devices.append(device)
            displaynames.append(displayname)
        config['frontend']['timer'] = data['timer']
        config['frontend']['devices'] = str(devices).replace("'", '"')
        config['frontend']['displaynames'] = str(
            displaynames).replace("'", '"')
        with open(f'{sys.path[0]}/config/config.ini', 'w') as configfile:
            config.write(configfile)
        socketio.emit('B2F_connected', get_config())
        return jsonify(result=True), 201

    # SOCKET IO


@socketio.on('connect')
def connect():
    print('A new client connects')

    emit('B2F_connected', get_config())


def get_config():
    dict_devices = {}
    devices = json.loads(config['frontend']['devices'])
    displaynames = json.loads(config['frontend']['displaynames'])
    for i in range(min(len(devices), len(displaynames))):
        dict_devices[displaynames[i]] = devices[i]
    timer = config['frontend']['timer']
    return {'timer': timer, 'devices': dict_devices}


def json_or_formdata(request):
    if request.content_type == 'application/json':
        gegevens = request.get_json()
    else:
        gegevens = request.form.to_dict()
    return gegevens
