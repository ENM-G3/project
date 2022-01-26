import configparser
from dataclasses import dataclass
from datetime import datetime

from flask_socketio import SocketIO, send, emit

import paho.mqtt.client as mqtt
import json
import time
import sys

config = configparser.ConfigParser()
config.read(f'{sys.path[0]}/config/smappee.ini')
topics = [("servicelocation/477d2645-2919-44c3-acf7-cad592ce7cdc/realtime", 0),
          ("servicelocation/4cfacd1f-914a-44ff-afdb-3671db497d4c/realtime", 0)]
dict_topics = {}
pops = []


class Mqtt:

    # The callback for when the client receives a CONNACK response from the server.

    @staticmethod
    def __on_connect(mqttclient, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        mqttclient.subscribe(topics)

    @staticmethod
    def __on_message_realtime(mqttclient, userdata, msg):

        try:
            # stuff to fix it not breaking
            if msg.topic not in dict_topics.keys():
                payload = str(msg.payload.decode("utf8"))
                payload = json.loads(payload)
                # print(dict_topics.values())

                if len(dict_topics) > 0 and payload['utcTimeStamp'] >= next(iter(dict_topics.values()))['utcTimeStamp']:

                    for key, value in dict_topics.items():
                        if payload['utcTimeStamp'] > value['utcTimeStamp']:
                            pops.add(key)

                    for key in pops:
                        dict_topics.pop(key, None)
                    pops.clear()

                    dict_topics[msg.topic] = payload
                else:
                    dict_topics[msg.topic] = payload

            if len(dict_topics) == len(topics):

                time = datetime.utcfromtimestamp(
                    int(payload['utcTimeStamp'])/1000)

                smappee_dicts = {
                    'utcTimeStamp': str(time), 'totalPower': 0}

                for payload in dict_topics.values():

                    for i in payload["channelPowers"]:
                        # print(i)
                        if config.has_option(str(i['serviceLocationId']), str(i['publishIndex'])):

                            if config[str(i['serviceLocationId'])][str(i['publishIndex'])] not in smappee_dicts.keys():
                                smappee_dicts[config[str(i['serviceLocationId'])][str(
                                    i['publishIndex'])]] = 0

                            smappee_dicts[config[str(i['serviceLocationId'])][str(
                                i['publishIndex'])]] += i['power']

                            smappee_dicts['totalPower'] += i['power']

                # Broadcast realtime data
                socketio.emit('B2F_realtime', {'data': smappee_dicts})
                # print(smappee_dicts)
                dict_topics.clear()
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
