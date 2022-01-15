import configparser
from dataclasses import dataclass
from datetime import datetime

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

import paho.mqtt.client as mqtt
import json
import time

class MqttDatabase:
    @staticmethod
    def __get_config():
        # Get config from the ini file
        config = configparser.ConfigParser()
        config.read('Backend\config.ini')
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
        # Get data from query (example query below)
        config = MqttDatabase.__get_config()
        org = config['mqtt']['org']

        client = MqttDatabase.__open_connection()

        tables = client.query_api().query(query, org=org)
        results = []
        for table in tables:
            for record in table.records:
                results.append(record.values)

        return results


    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(mqttclient, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        mqttclient.subscribe("servicelocation/477d2645-2919-44c3-acf7-cad592ce7cdc/realtime")

    data = ''
    # The callback for when a PUBLISH message is received from the server.
    def on_message(mqttclient, userdata, msg):
        payload = str(msg.payload.decode("utf-8"))
        res = json.loads(payload)
        global data
        data = res 
    
    @staticmethod
    def open_mqtt_connection():
        # open connection with mqtt
        mqttclient = mqtt.Client()
        mqttclient.on_connect = MqttDatabase.on_connect
        mqttclient.on_message = MqttDatabase.on_message

        mqttclient.connect("howest-energy-monitoring.westeurope.cloudapp.azure.com", 1883, 60)

        mqttclient.loop_start()
        time.sleep(2)
        print(data)
        return data
        mqttclient.loop_stop()


# TESTING
if __name__ == '__main__':

    MqttDatabase._open_mqtt_connection()