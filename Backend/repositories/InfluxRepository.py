import configparser
from InfluxDatabase import InfluxDatabase

### GET BUCKET FROM CONFIG ###
config = configparser.ConfigParser()
config.read('Backend\config.ini')
bucket = config['influx']['bucket']



class InfluxRepository:
    ### READ DATA ###
    def read_all_duiktank():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "Duiktank")'
        results = InfluxDatabase.get_data(query)
        return results

    def read_all_EB():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_EB_Niveau1_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results

    def read_all_HVAC():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_HVAC_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results

    def read_all_waterbehandeling():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_Waterbehandeling_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results

    def read_all_buitenbar():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Buitenbar_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results

    def read_all_CO2():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "CO2_5min")'
        results = InfluxDatabase.get_data(query)
        return results

    def read_all_compressor():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Compressor_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results

    def read_all_stopcontacten():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    
    def read_all_net():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "TotaalNet")'
        results = InfluxDatabase.get_data(query)
        return results



### TESTING ###
if __name__ == '__main__':

    for i in InfluxRepository.read_all_net():
        print(i)
