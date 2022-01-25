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
config.read(f'{sys.path[0]}/config/smappee.ini')


class Mqtt:

    # The callback for when the client receives a CONNACK response from the server.

    @staticmethod
    def __on_connect(mqttclient, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        mqttclient.subscribe(
            "servicelocation/477d2645-2919-44c3-acf7-cad592ce7cdc/realtime")

    @staticmethod
    def __on_message_realtime(mqttclient, userdata, msg):

        try:
            payload = str(msg.payload.decode("utf8"))
            payload = json.loads(payload)

            # print(payload)

            smappee_dicts = {'totalPower': 0}

            # for i in payload["channelPowers"]:
            #     location, power = '', ''
            #     for key, value in i.items():
            #         if key == "serviceLocationId":
            #             location = config["smappeeLocationId"][str(value)]
            #         if key == "apparentPower":
            #             power = value

            # if location not in smappee_dicts.keys():
            #     smappee_dicts[location] = 0

            # smappee_dicts[location] += power

            for i in payload["channelPowers"]:
                if config.has_option(str(i['serviceLocationId']), str(i['publishIndex'])):

                    if config[str(i['serviceLocationId'])][str(i['publishIndex'])] not in smappee_dicts.keys():
                        smappee_dicts[config[str(i['serviceLocationId'])][str(
                            i['publishIndex'])]] = 0

                    smappee_dicts[config[str(i['serviceLocationId'])][str(
                        i['publishIndex'])]] += i['power']

                    smappee_dicts['totalPower'] += i['power']

            print(smappee_dicts)

            # Broadcast realtime data
            socketio.emit('B2F_realtime', {'data': smappee_dicts})

            # print(smappee_dicts)
        except Exception as error:
            print(error)
            return

    @ staticmethod
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
