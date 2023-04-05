from flask import Blueprint, request, jsonify
import data_manager.cards as cards

api_cards = Blueprint('api_cards', __name__)

@api_cards.route('/api/cards/<id>', methods=['GET'])
def get_one(id):
    data = cards.get_one_by_id(id)
    if data is None or data is False:
        return 'Endpoint not found', 404
    return jsonify(data), 200

@api_cards.route('/api/cards', methods=['GET','POST','DELETE','PATCH'])
def crud():
    if request.method == 'GET':
        result, data = cards.get_by_column_id(request.json)
        if result:
            return jsonify(data), 200
        return data, 404
    
    elif request.method == 'DELETE':
        result, message = cards.delete_by_id(request.json)
        if result:
            return message, 200
        return message, 404
    
    elif request.method == 'PATCH':
        result, message = cards.change_message_by_id(request.json)
        if result:
            return message, 200
        return message, 404
    
    elif request.method == 'POST':
        result, message = cards.add(request.json)
        if result:
            return message, 200
        return message, 404
