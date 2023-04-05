from flask import Blueprint, request, jsonify
import data_manager.columns as columns

api_columns = Blueprint('api_columns', __name__)

@api_columns.route('/api/boards/<board_id>/columns', methods=['GET', 'POST', 'PATCH'])
def manage_all_columns_from_board(board_id):
    """Manages all columns that belong to <board_id> board,
    GET > Return json with all columns,
    POST > Creates new column for that board,
    PATCH > Updates a list of columns if necessery

    Args:
        board_id (str): board id

    Returns:
        str or json: json when methed GET else feedback, finally status code
    """    
    if request.method == 'GET':
        result, data = columns.get_all_by_board_id(board_id)
        return (jsonify(data), 200) if result else (data, 404)

    elif request.method == 'POST':
        result, message = columns.add(board_id, request.json)
        return (message, 200) if result else (message, 404)

    elif request.method == 'PATCH':
        result, message =  columns.segregate(request.json)
        return (message, 200) if result else (message, 404)

@api_columns.route('/api/columns/<column_id>', methods=['GET', 'DELETE', 'PATCH'])
def manage_single_column(column_id):
    """Manages a single column with <column_id>,
    GET > Returns json with that column id,
    DELETE > Deletes column with that id,
    PATCH > Updates single column

    Args:
        column_id (str): column id

    Returns:
        str or json: json when methed GET else feedback, finally status code
    """    
    if request.method == 'GET':
        data = columns.get_one(column_id)
        if data is None or data is False:
            return 'Endpoint not found', 404
        return jsonify(data), 200
    
    elif request.method == 'DELETE':
        result, message = columns.delete_by_id(column_id)
        return (message, 200) if result else (message, 404)
    
    elif request.method == 'PATCH':
        result, message = columns.update_by_id(column_id, request.json)
        return (message, 200) if result else (message, 404)
    

