from __main__ import socketio
from flask_socketio import rooms, join_room, leave_room, emit
from flask import request
from data_handler.columns import get_one_by_id

# ROOMS MANAGEMENT

@socketio.on('join')
def on_join(room_id):
    join_room(room_id)


@socketio.on('leave')
def on_leave(room_id):
    leave_room(room_id)

# BOARDS MANAGEMENT


@socketio.on('update_board_title')
def update_board_title(board_id, board_title):
    emit('update_board_title', (board_id, board_title), skip_sid=request.sid, to=rooms())


@socketio.on('delete_board')
def delete_board_handler(board_id):
    emit('delete_board', board_id, skip_sid=request.sid, to=rooms())

# COLUMNS MANAGEMENT


@socketio.on('update_column_title')
def update_column_title(column_title, column_id):
    emit('update_column_title', (column_title, column_id), skip_sid=request.sid, to=rooms())


@socketio.on('update_column_position')
def update_column_position(first_column_id, second_column_id):
    first_column = get_one_by_id(first_column_id)
    second_column = get_one_by_id(second_column_id)
    emit('update_column_position', (first_column, second_column), skip_sid=request.sid, to=rooms())


@socketio.on('create_column')
def create_column_handler(column_data, board_id):
    emit('create_column', (column_data, board_id), skip_sid=request.sid, to=rooms())


@socketio.on('delete_column')
def delete_column_handler(column_id):
    emit('delete_column', column_id, skip_sid=request.sid, to=rooms())

# CARDS MANAGEMENT


@socketio.on('update_card_title')
def update_card_title(card_title, card_id):
    emit('update_card_title', (card_title, card_id), skip_sid=request.sid, to=rooms())


@socketio.on('update_card_position')
def update_card_position(card_id, column_id):
    emit('update_card_position', (card_id, column_id), skip_sid=request.sid, to=rooms())


@socketio.on('create_card')
def create_card_handler(card_data, column_id):
    emit('create_card', (card_data, column_id), skip_sid=request.sid, to=rooms())


@socketio.on('delete_card')
def delete_card_handler(card_id):
    emit('delete_card', card_id, skip_sid=request.sid, to=rooms())
