from flask import Blueprint, jsonify, request
import data_handler.boards as boards

api_boards = Blueprint('api_boards', __name__)


@api_boards.route("/api/boards", methods=['GET', 'POST'])
def manage_all_boards():
    if request.method == 'GET':
        return jsonify(boards.get_all()), 200
    
    elif request.method == 'POST':
        message = boards.add(request.json)
        return message, 200

@api_boards.route("/api/boards/<board_id>", methods=['GET','POST','DELETE','PATCH'])
def manage_single_board(board_id):
    if request.method == 'GET':
        data = boards.get_one_by_id(board_id)
        if data is None or data is False:
            return 'Endpoint not found', 404
        return jsonify(data), 200
    
    elif request.method == 'DELETE':
        result, message = boards.delete_by_id(board_id)
        return (message, 200) if result else (message, 404)
    
    elif request.method == 'PATCH':
        result, message = boards.update_by_id(board_id, request.json)
        return (message, 200) if result else (message, 404)


