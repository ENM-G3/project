from .CosmosDatabase import CosmosDatabase
import uuid


class CosmosRepository:

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
    