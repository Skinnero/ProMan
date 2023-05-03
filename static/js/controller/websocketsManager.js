import {io} from "socket.io-client"
import {buildColumns} from "./columnsManager.js"
import {buildCards} from "./cardManager.js"
// export const socket = io("wss://promandk.onrender.com:8000")
export const socket = io("ws://127.0.0.1:5000")

socket.on('update_board_title', (boardId, boardTitle) => {
    document.querySelector('.board-title textarea').value = boardTitle
    document.querySelector(`.sidebar-board[data-id="${boardId}"] h5`).innerText = boardTitle
})

socket.on('delete_board', (boardId) => {
    document.querySelector(`.board[data-id='${boardId}']`).remove()
    document.querySelector(`li[data-id='${boardId}']`).remove()
})

socket.on('update_column_title', (columnTitle, columnId) => {
    document.querySelector(`[data-id="${columnId}"] .column-title textarea`).value = columnTitle
})

socket.on('update_column_position', (firstColumn, secondColumn) => {
    console.log({firstColumn, secondColumn})
    // TODO: FIX COLUMNS MOVEMENT
    document.querySelector('.board-content').insertBefore(
        document.querySelector(`.column[data-id="${firstColumn.id}"]`),
        document.querySelector('.board-content').childNodes[firstColumn['order_number']]
    )
    document.querySelector('.board-content').insertBefore(
        document.querySelector(`.column[data-id="${secondColumn.id}"]`),
        document.querySelector('.board-content').childNodes[secondColumn['order_number']]
    )
})

socket.on('create_column', (columnData, boardId) => {
    buildColumns([columnData[columnData.length - 1]], boardId)
})

socket.on('delete_column', (columnId) => {
    document.querySelector(`.column[data-id='${columnId}']`).remove()
})

socket.on('update_card_title', (cardTitle, cardId) => {
    document.querySelector(`[data-id="${cardId}"] .card-title textarea`).value = cardTitle
})

socket.on('update_card_position', (cardId, newColumnId) => {
    document.querySelector(`.column-content[data-id="${newColumnId}"]`).appendChild(
        document.querySelector(`.card[data-id="${cardId}"]`)
    )
})

socket.on('create_card', (cardData, columnId) => {
    buildCards([cardData[cardData.length - 1]], columnId)
})

socket.on('delete_card', (cardId) => {
    document.querySelector(`.card[data-id='${cardId}']`).remove()
})
