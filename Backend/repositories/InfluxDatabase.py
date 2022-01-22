import configparser
from datetime import datetime
import sys

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

config = configparser.ConfigParser()
config.read(f'{sys.path[0]}/config.ini')
token = config['influx']['token']
url = config['influx']['url']
org = config['influx']['org']
bucket = config['influx']['bucket']


class InfluxDatabase:

    @staticmethod
    def __open_connection():
        # Open connection with influx
        try:
            client = InfluxDBClient(url=url, token=token)
            return client
        except Exception as error:
            print("Error: Geen toegang tot influx database")
            return

    @staticmethod
    def get_data(query):
        # Get data from query (example query below)
        client = InfluxDatabase.__open_connection()

        try:
            tables = client.query_api().query(query, org=org)
            results = []
            for table in tables:
                for record in table.records:
                    results.append(record.values)
        except Exception as error:
            results = None
        finally:
            return results

    @staticmethod
    def write_data(data):
        client = InfluxDatabase.__open_connection()
        try:
            write_api = client.write_api(write_options=SYNCHRONOUS)
            write_api.write(bucket, org, data)
        except Exception as error:
            print(error)
            return


# if __name__ == '__main__':

#     config = configparser.ConfigParser()
#     config.read(f'{sys.path[0]}\config.ini')
#     bucket = config['influx']['bucket']

#     for i in InfluxDatabase.get_data(f'from(bucket: \"{bucket}\") |> range(start: -1h)'):
#         print(i)
