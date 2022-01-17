import configparser
from dataclasses import dataclass
from datetime import datetime

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

import paho.mqtt.client as mqtt
import json
import time
import sys

class MqttDatabase:
    @staticmethod
    def __get_config():
        # Get config from the ini file
        config = configparser.ConfigParser()
        config.read(f'{sys.path[0]}\config.ini')
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

        data = f"{location},meter={device} power={value}"
        write_api.write(bucket, org, data)



    # The callback for when the client receives a CONNACK response from the server.
    @staticmethod
    def __on_connect(mqttclient, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        mqttclient.subscribe("servicelocation/477d2645-2919-44c3-acf7-cad592ce7cdc/realtime")

    # The callback for when a PUBLISH message is received from the server.
    @staticmethod
    def __on_message(mqttclient, userdata, msg):
        config = MqttDatabase.__get_config()

        payload = str(msg.payload.decode("utf8"))
        payload = json.loads(payload)
        newJson = []
        for i in payload["channelPowers"]:
            newDict = {}
            device, location, power = '', '', ''

            for key, value in i.items():
                if key == "publishIndex":
                    newDict[key] = config["smappeePublishIndex"][str(value)]
                    device = config["smappeePublishIndex"][str(value)]
                if key == "serviceLocationId":
                    newDict[key] = config["smappeeLocationId"][str(value)]
                    location = config["smappeeLocationId"][str(value)]
                if key == "power":
                    newDict[key] = value
                    power = value


            MqttDatabase.__write_db_data(device, location, power)    
            newJson.append(newDict)
    
    @staticmethod
    def open_mqtt_connection():
        # open connection with mqtt
        mqttclient = mqtt.Client()
        mqttclient.on_connect = MqttDatabase.__on_connect
        mqttclient.on_message = MqttDatabase.__on_message

        mqttclient.connect("howest-energy-monitoring.westeurope.cloudapp.azure.com", 1883, 60)

        mqttclient.loop_start()
        time.sleep(5)
        mqttclient.loop_stop()


# TESTING
# if __name__ == '__main__':

#     MqttDatabase.open_mqtt_connection()

#     config = configparser.ConfigParser()
#     config.read('Backend\config.ini')
#     bucket = config['mqtt']['bucket']

#     for i in MqttDatabase.get_db_data(f'from(bucket: \"{bucket}\") |> range(start: -1mo) '):
#         print(i)