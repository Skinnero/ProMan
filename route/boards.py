from flask import Blueprint, jsonify, request
import data_manager.boards as boards

api_boards = Blueprint('api_boards', __name__)


@api_boards.route("/api/boards", methods=['GET','POST','DELETE','PATCH'])
def boards_crud():
    if request.method == 'GET':
        return jsonify(boards.get_all())
    
    elif request.method == 'DELETE':
        if boards.delete_by_id(request.json):
            return '', 200
        return 'ValueError: id must be able to convert into int', 404
    
    elif request.method == 'PATCH':
        if boards.rename_by_id(request.json):
            return '', 200
        return 'ValueError: id must be able to convert into int', 404
    
    elif request.method == 'POST':
        boards.add(request.json)
        return '', 200







# @api_boards.route('/api/boards/delete', methods=['DELETE'])
# def delete_board():
   
# @api_boards.route('/api/boards/rename', methods=['PATCH'])
# def rename_board():
    

# @api_boards.route('/api/boards/add')