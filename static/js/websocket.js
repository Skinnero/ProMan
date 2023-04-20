import io from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
export const socket = io("ws://127.0.0.1:5000")


socket.on('connect', () => {
    console.log('Connected to Server!')
})

socket.emit('message', 'Hello from client!')

export function pull_board(){
    setInterval()
}