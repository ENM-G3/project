import configparser
from dataclasses import dataclass
from datetime import datetime
from .InfluxRepository import InfluxRepository

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
from flask_socketio import SocketIO, send, emit

import paho.mqtt.client as mqtt
import json
import time
import sys


class MqttDatabase:

    @staticmethod
    def __get_config():
        # Get config from the ini file
        config = configparser.ConfigParser()
        config.read(f'{sys.path[0]}/config.ini')
        return config

    @staticmethod
    def __open_db_connection():
        # Open connection with influx
        config = MqttDatabase.__get_config()
        token = config['mqtt']['token']
        url = config['mqtt']['url']

        dbclient = InfluxDBClient(url=url, token=token)

        return dbclient

    @staticmethod
    def get_db_data(query):
        config = MqttDatabase.__get_config()
        org = config['mqtt']['org']

        dbclient = MqttDatabase.__open_db_connection()

        tables = dbclient.query_api().query(query, org=org)
        results = []
        for table in tables:
            for record in table.records:
                results.append(record.values)

        return results

    @staticmethod
    def __write_db_data(location, device, value):
        config = MqttDatabase.__get_config()
        bucket = config['mqtt']['bucket']
        org = config['mqtt']['org']

        dbclient = MqttDatabase.__open_db_connection()

        write_api = dbclient.write_api(write_options=SYNCHRONOUS)

        data = f"{location},meter=Smappee {device}={value}"
        write_api.write(bucket, org, data)

    # The callback for when the client receives a CONNACK response from the server.

    @staticmethod
    def __on_connect(mqttclient, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        mqttclient.subscribe(
            "servicelocation/477d2645-2919-44c3-acf7-cad592ce7cdc/realtime")

    # The callback for when a PUBLISH message is received from the server.
    @staticmethod
    def __on_message_db(mqttclient, userdata, msg):
        config = MqttDatabase.__get_config()

        payload = str(msg.payload.decode("utf8"))
        payload = json.loads(payload)
        for i in payload["channelPowers"]:
            device, location, power = '', '', ''
            for key, value in i.items():
                if key == "formula":
                    device = config["smappeePublishIndex"][str(value)]
                if key == "serviceLocationId":
                    location = config["smappeeLocationId"][str(value)]
                if key == "power":
                    power = value

            MqttDatabase.__write_db_data(location, device, power)

        mqttclient.loop_stop()

    @staticmethod
    def __on_message_realtime2(mqttclient, userdata, msg):
        config = MqttDatabase.__get_config()

        payload = str(msg.payload.decode("utf8"))
        payload = json.loads(payload)

        smappee_dicts = {}
        smappee_totals = {}

        for i in payload["channelPowers"]:
            location, power = '', ''
            for key, value in i.items():
                if key == "serviceLocationId":
                    location = config["smappeeLocationId"][str(value)]
                if key == "apparentPower":
                    power = value

            # print(i)

            if location not in smappee_dicts.keys():
                smappee_dicts[location] = 0

            smappee_dicts[location] += power

        duiktank = InfluxRepository.read_last_data_from_device(
            'Duiktank', 'TotaalNet')[0]

        smappee_dicts[duiktank["_measurement"]] = duiktank["_value"]

        # Broadcast realtime data
        socketio.emit('B2F_realtime', {'data': smappee_dicts})

        # print(smappee_dicts)

    @staticmethod
    def __on_message_realtime(mqttclient, userdata, msg):
        config = MqttDatabase.__get_config()

        payload = str(msg.payload.decode("utf8"))
        payload = json.loads(payload)
        previous_device = ''
        previous_location = ''
        device, location, power = '', '', ''
        for i in payload["channelPowers"]:
            for key, value in i.items():
                print(key, value)
                if key == "formula":
                    device = config["smappeePublishIndex"][str(value)][:-3]
                    if device == previous_device:
                        print("same device")
                    else:
                        previous_device = device
                        print("new device")

                if key == "power":
                    power = value
                    print(device, previous_device)
                    if device == previous_device:
                        print("add to power")
                    else:
                        print("new power")

    @staticmethod
    def open_mqtt_connection_and_write_to_db():
        # open connection with mqtt
        mqttclient = mqtt.Client()
        mqttclient.on_connect = MqttDatabase.__on_connect
        mqttclient.on_message = MqttDatabase.__on_message_db

        mqttclient.connect(
            "howest-energy-monitoring.westeurope.cloudapp.azure.com", 1883, 60)

        mqttclient.loop_start()

    @staticmethod
    def open_mqtt_connection_realtime(socket):
        global socketio
        socketio = socket
        # open connection with mqtt
        mqttclient = mqtt.Client()
        mqttclient.on_connect = MqttDatabase.__on_connect
        mqttclient.on_message = MqttDatabase.__on_message_realtime2
        mqttclient.on_disconnect = MqttDatabase.open_mqtt_connection_realtime

        mqttclient.connect(
            "howest-energy-monitoring.westeurope.cloudapp.azure.com", 1883, 60)

        mqttclient.loop_forever()
