import configparser
import datetime
import uuid

import azure.cosmos.documents as documents
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.exceptions as exceptions
from azure.cosmos.partition_key import PartitionKey

config = configparser.ConfigParser()
config.read('Backend\config.ini')

HOST = config['cosmos']['url']
MASTER_KEY = config['cosmos']['key']
DATABASE_ID = config['cosmos']['database_id']
CONTAINER_ID = config['cosmos']['container_id']


class CosmosDatabase:

    @staticmethod
    def __open_connection():
        client = cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY})
        db = client.create_database_if_not_exists(id=DATABASE_ID)
        container = db.create_container_if_not_exists(
            id=CONTAINER_ID, partition_key=PartitionKey(path='/id', kind='Hash'))
        return container

    @staticmethod
    def create_item(item):
        container = CosmosDatabase.__open_connection()
        result = container.create_item(body=item)
        return result

    @staticmethod
    def read_items():
        container = CosmosDatabase.__open_connection()
        items = list(container.read_all_items())
        return items

    @staticmethod
    def query_items(sqlQuery, params=None):
        container = CosmosDatabase.__open_connection()
        items = list(container.query_items(
            query=sqlQuery,
            parameters=params,
            enable_cross_partition_query=True
        ))
        return items

    @staticmethod
    def delete_item(id):
        container = CosmosDatabase.__open_connection()
        result = container.delete_item(item=id, partition_key=id)
        return result


