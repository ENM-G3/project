import configparser
from dataclasses import dataclass
from datetime import datetime
from .InfluxRepository import InfluxRepository

from flask_socketio import SocketIO, send, emit

import paho.mqtt.client as mqtt
import json
import time
import sys

config = configparser.ConfigParser()
config.read(f'{sys.path[0]}/config.ini')
# token = config['mqtt']['token']
# url = config['mqtt']['url']
# org = config['mqtt']['org']
# bucket = config['mqtt']['bucket']


class Mqtt:

    # The callback for when the client receives a CONNACK response from the server.

    @staticmethod
    def __on_connect(mqttclient, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        mqttclient.subscribe(
            "servicelocation/477d2645-2919-44c3-acf7-cad592ce7cdc/realtime")

    # The callback for when a PUBLISH message is received from the server.
    @staticmethod
    def __on_message_db(mqttclient, userdata, msg):

        try:
            payload = str(msg.payload.decode("utf8"))
            payload = json.loads(payload)

            smappee_dicts = {}

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

            # print(smappee_dicts)

            InfluxRepository.write_mqtt_data(smappee_dicts)

            mqttclient.loop_stop()
        except Exception as error:
            return

    @staticmethod
    def __on_message_realtime(mqttclient, userdata, msg):

        try:
            payload = str(msg.payload.decode("utf8"))
            payload = json.loads(payload)

            smappee_dicts = {}

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
        except Exception as error:
            return

    @staticmethod
    def open_mqtt_connection_and_write_to_db():
        # open connection with mqtt
        mqttclient = mqtt.Client()
        mqttclient.on_connect = Mqtt.__on_connect
        mqttclient.on_message = Mqtt.__on_message_db

        mqttclient.connect(
            "howest-energy-monitoring.westeurope.cloudapp.azure.com", 1883, 60)

        mqttclient.loop_start()

    @staticmethod
    def open_mqtt_connection_realtime(socket):
        global socketio
        socketio = socket
        # open connection with mqtt
        mqttclient = mqtt.Client()
        mqttclient.on_connect = Mqtt.__on_connect
        mqttclient.on_message = Mqtt.__on_message_realtime
        mqttclient.on_disconnect = Mqtt.open_mqtt_connection_realtime

        mqttclient.connect(
            "howest-energy-monitoring.westeurope.cloudapp.azure.com", 1883, 60)

        mqttclient.loop_forever()
