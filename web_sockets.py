from flask_socketio import rooms, join_room, leave_room, emit
from flask import request
from __main__ import socketio

# ROOMS MANAGEMENT


@socketio.on('join')
def on_join(room_id):
    join_room(room_id)


@socketio.on('leave')
def on_leave(room_id):
    leave_room(room_id)

# BOARDS MANAGEMENT


@socketio.on('update_board_title')
def update_board_title(board_title):
    emit('update_board_title', board_title, skip_sid=request.sid, to=rooms()[1])

# COLUMNS MANAGEMENT


@socketio.on('update_column_title')
def update_column_title(column_title):
    emit('update_column_title', column_title, skip_sid=request.sid, to=rooms()[1])


@socketio.on('update_column_position')
def update_column_position():
    emit('update_column_position', 'column_position ', skip_sid=request.sid, to=rooms()[1])


@socketio.on('create_column')
def create_handler(column_html):
    emit('create_column', column_html, skip_sid=request.sid, to=rooms()[1])


@socketio.on('delete_column')
def delete_column(column_id):
    emit('delete_column', column_id, skip_sid=request.sid, to=rooms()[1])

# CARDS MANAGEMENT


@socketio.on('update_card_title')
def update_card_title(card_title):
    emit('update_card_title', card_title, skip_sid=request.sid, to=rooms()[1])


@socketio.on('update_card_position')
def update_card_position():
    emit('update_card_position', 'card_position', skip_sid=request.sid, to=rooms()[1])


@socketio.on('create_card')
def update_card_position(card_html):
    emit('create_card', card_html, skip_sid=request.sid, to=rooms()[1])


@socketio.on('delete_card')
def update_card_position(card_id):
    emit('delete_card', card_id, skip_sid=request.sid, to=rooms()[1])
