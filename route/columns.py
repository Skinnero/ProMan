from flask import Blueprint, request, jsonify
import data_manager.columns as colmuns

api_columns = Blueprint('api_columns', __name__)

@api_columns.route('/api/columns', methods=['GET','POST','DELETE','PATCH'])
def columns_crud():
    if request.method == 'GET':
        data = colmuns.get_by_board_id(request.json)
        if not data:
            return '', 404
        return jsonify(data), 200
    
    elif request.method == 'DELETE':
        if colmuns.delete_by_id(request.json):
            return '', 200
        return 'ValueError: id must be able to convert into int', 404
    
    elif request.method == 'PATCH':
        if colmuns.rename_by_id(request.json):
            return '', 200
        return 'ValueError: id must be able to convert into int', 404
    
    elif request.method == 'POST':
        colmuns.add(request.json)
        return '', 200
