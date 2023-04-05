from flask import Blueprint, jsonify, request
import data_manager.boards as boards

api_boards = Blueprint('api_boards', __name__)


@api_boards.route("/api/boards/<id>", methods=['GET'])
def get_one(id):
    data = boards.get_one_by_id(id)
    if data is None or data is False:
        return 'Endpoint not found', 404
    return jsonify(data), 200

@api_boards.route("/api/boards", methods=['GET','POST','DELETE','PATCH'])
def crud():
    if request.method == 'GET':
        return jsonify(boards.get_all()), 200
    
    elif request.method == 'DELETE':
        result, message = boards.delete_by_id(request.json)
        if result:
            return message, 200
        return message, 404
    
    elif request.method == 'PATCH':
        result, message = boards.rename_by_id(request.json)
        if result:
            return message, 200
        return message, 404
    
    elif request.method == 'POST':
        message = boards.add(request.json)
        return message, 200

