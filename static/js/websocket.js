import {io} from "socket.io-client"
import * as columnsManager from './controller/columnsManager.js'
import * as cardsManager from './controller/cardsManager.js'
export const socket = io("ws://127.0.0.1:5000")

socket.on('connect', (message) => {
    console.log(message)
})


socket.on('join', () => {
    console.log('xD')
})


socket.on('create_column', (columnDiv) => {
    let test = new DOMParser().parseFromString(columnDiv, 'text/html').body.childNodes[0]
    console.log(test)
    columnsManager.addSingleColumn(test)
    cardsManager.setCardsOnSingleColumn(test)
})

// socket.send("message", 'Hello, ')

