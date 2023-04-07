from flask import Blueprint, request, jsonify
import data_handler.columns as columns

api_columns = Blueprint('api_columns', __name__)

@api_columns.route('/api/boards/<board_id>/columns', methods=['GET', 'POST', 'PATCH'])
def manage_all_columns_from_board(board_id):
    if request.method == 'GET':
        result, data = columns.get_by_board_id(board_id)
        return (jsonify(data), 200) if result else (data, 404)

    elif request.method == 'POST':
        result, message = columns.add(board_id, request.json)
        return (message, 200) if result else (message, 404)

    elif request.method == 'PATCH':
        result, message =  columns.segregate(request.json)
        return (message, 200) if result else (message, 404)

@api_columns.route('/api/columns/<column_id>', methods=['GET', 'POST', 'DELETE', 'PATCH'])
def manage_single_column(column_id):
    if request.method == 'GET':
        data = columns.get_one_by_id(column_id)
        if data is None or data is False:
            return 'Endpoint not found', 404
        return jsonify(data), 200
    
    elif request.method == 'DELETE':
        result, message = columns.delete_by_id(column_id)
        return (message, 200) if result else (message, 404)
    
    elif request.method == 'PATCH':
        result, message = columns.update_by_id(column_id, request.json)
        return (message, 200) if result else (message, 404)
    

