import configparser
from .InfluxDatabase import InfluxDatabase
import sys

### GET BUCKET FROM CONFIG ###
config = configparser.ConfigParser()
config.read(f'{sys.path[0]}/config.ini')
bucket = config['influx']['bucket']


class InfluxRepository:
    ### READ DATA ###
    @staticmethod
    def read_data(measurement, time):
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._measurement == "{measurement}")'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_data_from_device(measurement, time, device):
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._measurement == "{measurement}") |> filter(fn: (r) => r._field == "{device}")'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_watthour_from_device(measurement, time, device, pertime):
        pertime_dict = {'1h': 1, '1d': 24, '1w': 24*7}
        query = f'from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._measurement == "{measurement}") |> filter(fn: (r) => r._field == "{device}") |> truncateTimeColumn(unit: {pertime}) |> group(columns: ["_time"]) |> mean() |> map(fn: (r) => ({{ r with _value: r._value * {pertime_dict[pertime]}.0 }}))'
        results = InfluxDatabase.get_data(query)
        return results

    @staticmethod
    def read_day_night_from_device(measurement, time, device):
        query = f'import "date" from(bucket: \"{bucket}\") |> range(start: -{time}) |> filter(fn: (r) => r._measurement == "{measurement}") |> filter(fn: (r) => r._field == "{device}") |> map(fn: (r) => ({{r with day: if date.hour(t: r._time) >= 7 and date.hour(t: r._time) < 22 then true else false}})) |> group(columns: ["day"]) |> mean()'
        results = InfluxDatabase.get_data(query)
        return results

# ### TESTING ###
# if __name__ == '__main__':

#     for i in InfluxRepository.read_all_net_year():
#         print(i)
