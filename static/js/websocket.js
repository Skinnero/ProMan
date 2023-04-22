import {io} from "socket.io-client"

export const socket = io("ws://127.0.0.1:5000")

socket.on('connect', () => {
    console.log('xD')
    console.log('Connected to Server!')
})

socket.emit('message', 'Hello back')

// export function pull_board(){
//     setInterval()
// }