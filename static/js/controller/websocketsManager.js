import {io} from "socket.io-client"

export const socket = io("ws://127.0.0.1:5000")

socket.on('update_board_title', (boardTitle) => {
    //script
})

socket.on('delete_board', () => {
    //script
})

socket.on('update_column_title', (columnTitle) => {
    // Script
})

socket.on('update_column_position', () => {
    // Script
})

socket.on('create_column', (columnDiv) => {
    // Script
})

socket.on('delete_column', (columnId) => {
    // Script
})

socket.on('update_card_title', (cardTitle) => {
    // Script
})

socket.on('update_card_position', () => {
    // Script
})

socket.on('create_card', (cardDiv) => {
    // Script
})

socket.on('delete_card', (cardId) => {
    // Script
})
