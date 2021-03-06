import configparser
from .InfluxDatabase import InfluxDatabase
import sys

### GET BUCKET FROM CONFIG ###
config = configparser.ConfigParser()
config.read(f'{sys.path[0]}/config/config.ini')
bucket = config['influx']['bucket']


class InfluxRepository:
    ### READ DATA ###
    @staticmethod
    def read_data(time):
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time})'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_data_from_device(time, device):
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._field == "{device}")'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_last_data_from_device(device):
        query = f'from(bucket: \"{bucket}\") |> range(start: -1h) |> last() |> filter(fn: (r) => r._field == "{device}")'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_watthour_from_device(time, device, pertime):
        pertime_dict = {'1h': 1, '1d': 24, '1w': 24*7}
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._field == "{device}") |> truncateTimeColumn(unit: {pertime}) |> group(columns: ["_time"]) |> mean() |> map(fn: (r) => ({{ r with _value: r._value * {pertime_dict[pertime]}.0 }}))'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_total_watthour(time, pertime):
        pertime_dict = {'1h': 1, '1d': 24, '1w': 24*7}
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._field == "TotaalNet" or r._field == "Totaal" or r._field == "Totaal_EB2") |> truncateTimeColumn(unit: {pertime}) |> group(columns: ["_time", "_field"]) |> mean() |> group(columns: ["_time"]) |> sum() |> map(fn: (r) => ({{ r with _value: r._value * {pertime_dict[pertime]}.0 }}))'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_average_watt_from_device(time, device):
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._field == "{device}") |> mean()'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_total_average_watt(time):
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._field == "TotaalNet" or r._field == "Totaal" or r._field == "Totaal_EB2") |> group(columns: ["_field"]) |> mean() |> group() |> sum()'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_day_night_from_device(time, device):
        query = f'import "date" from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._field == "{device}") |> map(fn: (r) => ({{r with day: if date.hour(t: r._time) >= 7 and date.hour(t: r._time) < 22 then true else false}})) |> group(columns: ["day"]) |> mean()'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def write_mqtt_data(dict_data):
        for key, value in dict_data.items():
            data = f"{key},meter=Smappee TotaalNet={value}"
            InfluxDatabase.write_data(data)
