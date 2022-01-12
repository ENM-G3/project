import configparser
from datetime import datetime

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS


class InfluxDatabase:

    @staticmethod
    def __get_config():
        # Get config from the ini file
        config = configparser.ConfigParser()
        config.read('Backend\config.ini')
        return config

    @staticmethod
    def __open_connection():
        # Open connection with influx
        config = InfluxDatabase.__get_config()
        token = config['influx']['token']
        url = config['influx']['url']

        client = InfluxDBClient(url=url, token=token)

        return client

    @staticmethod
    def get_data(query):
        # Get data from query (example query below)
        config = InfluxDatabase.__get_config()
        org = config['influx']['org']

        client = InfluxDatabase.__open_connection()

        tables = client.query_api().query(query, org=org)
        results = []
        for table in tables:
            for record in table.records:
                results.append({"Place": record.get_measurement(), "Type": record.get_field(), "Value": record.get_value(), "Time": record.get_time()})

        return results


if __name__ == '__main__':

    config = configparser.ConfigParser()
    config.read('Backend\config.ini')
    bucket = config['influx']['bucket']

    for i in InfluxDatabase.get_data(f'from(bucket: \"{bucket}\") |> range(start: -1h)'):
        print(i)
