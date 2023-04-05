from flask import Blueprint, request, jsonify
import data_manager.columns as colmuns

api_columns = Blueprint('api_columns', __name__)

@api_columns.route('/api/columns/<id>', methods=['GET'])
def get_one(id):
    data = colmuns.get_one_by_id(id)
    if data is None or data is False:
        return 'Endpoint not found', 404
    return jsonify(data), 200

@api_columns.route('/api/columns', methods=['GET','POST','DELETE','PATCH'])
def crud():
    if request.method == 'GET':
        result, data = colmuns.get_by_board_id(request.json)
        if result:
            return jsonify(data), 200
        return data, 404
    
    elif request.method == 'DELETE':
        result, message = colmuns.delete_by_id(request.json)
        if result:
            return message, 200
        return message, 404
    
    elif request.method == 'PATCH':
        result, message = colmuns.rename_by_id(request.json)
        if result:
            return message, 200
        return message, 404
    
    elif request.method == 'POST':
        result, message = colmuns.add(request.json)
        if result:
            return message, 200
        return message, 404
