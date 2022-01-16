from .CosmosDatabase import CosmosDatabase
import uuid


class CosmosRepository:

    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    @staticmethod
    def create_weetje(fact):

        guid = str(uuid.uuid4())
        weetje = {
            'id': guid1,
            'type': 'weetje',
            'fact': fact
        }

        result = CosmosDatabase.create_item(weetje)

        return result

    @staticmethod
    def create_vergelijking(name, amount, unit, time):

        guid = str(uuid.uuid4())
        vergelijking = {
            'id': guid1,
            'type': 'vergelijking',
            'name': name,
            'amount': amount,
            'unit': unit,
            'time': time
        }

        result = CosmosDatabase.create_item(vergelijking)

        return result

    @staticmethod
    def create_meerkeuze(question, options, answer):

        guid = str(uuid.uuid4())
        vraag = {
            'id': guid1,
            'type': 'meerkeuze',
            'question': question,
            'options': options,
            'answer': answer
        }

        result = CosmosDatabase.create_item(vraag)

        return result

    @staticmethod
    def get_all_items():
        items = CosmosDatabase.read_items()
        return items

    @staticmethod
    def get_item_by_id(id):
        sql = 'SELECT * FROM c WHERE c.id=@id'
        params = [{"name": "@id", 'value': id}]
        items = CosmosDatabase.query_items(sql, params)

        return items

    @staticmethod
    def get_all_weetjes_van_type(typeweetje):
        sql = 'SELECT * FROM c WHERE c.type=@type'
        params = [{"name": "@type", 'value': typeweetje}]
        items = CosmosDatabase.query_items(sql, params)

        return items

    @staticmethod
    def delete_item(id):

        if len(get_item_by_id(id) > 0):
            CosmosDatabase.delete_item(id)
            return True

        else:
            return False
