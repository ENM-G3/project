import configparser
from InfluxDatabase import InfluxDatabase

### GET BUCKET FROM CONFIG ###
config = configparser.ConfigParser()
config.read('Backend\config.ini')
bucket = config['influx']['bucket']



class InfluxRepository:
    ### READ DATA ###
    def read_all_duiktank_day():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "Duiktank")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_duiktank_month():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1mo) |> filter(fn: (r) => r._measurement == "Duiktank")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_duiktank_year():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1y) |> filter(fn: (r) => r._measurement == "Duiktank")'
        results = InfluxDatabase.get_data(query)
        return results



    def read_all_EB_day():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_EB_Niveau1_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_EB_month():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1mo) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_EB_Niveau1_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_EB_year():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1y) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_EB_Niveau1_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results



    def read_all_HVAC_day():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_HVAC_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_HVAC_month():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1mo) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_HVAC_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_HVAC_year():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1y) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_HVAC_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results



    def read_all_waterbehandeling_day():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_Waterbehandeling_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_waterbehandeling_month():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1mo) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_Waterbehandeling_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_waterbehandeling_year():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1y) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Bord_Waterbehandeling_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results



    def read_all_buitenbar_day():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Buitenbar_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_buitenbar_month():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1mo) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Buitenbar_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_buitenbar_year():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1y) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Buitenbar_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results



    def read_all_CO2_day():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "CO2_5min")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_CO2_month():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1mo) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "CO2_5min")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_CO2_year():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1y) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "CO2_5min")'
        results = InfluxDatabase.get_data(query)
        return results


    def read_all_compressor_day():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Compressor_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_compressor_month():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1mo) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Compressor_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_compressor_year():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1y) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Compressor_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results



    def read_all_stopcontacten_day():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_stopcontacten_month():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1mo) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_stopcontacten_year():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1y) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "Stopcontacten_Circuit_Niveau0_Cafetaria_Totaal")'
        results = InfluxDatabase.get_data(query)
        return results
    


    def read_all_net_day():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "TotaalNet")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_net_month():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1mo) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "TotaalNet")'
        results = InfluxDatabase.get_data(query)
        return results
    def read_all_net_year():
        query = f'from(bucket: \"{bucket}\") |> range(start: -1y) |> filter(fn: (r) => r._measurement == "Duiktank") |> filter(fn: (r) => r._field == "TotaalNet")'
        results = InfluxDatabase.get_data(query)
        return results



### TESTING ###
if __name__ == '__main__':

    for i in InfluxRepository.read_all_net_month():
        print(i)
