export function getBoardsList(board){
    return `
    <textarea data-id=${board.id}>${board.name}</textarea><button id="show" data-id=${board.id}>+</button>
    <button id="delete" data-id=${board.id}>-</button>
    `
}

export function getBoardsDiv(){
    let boardDiv = document.createElement('div')
    let createBoardButton = document.createElement('button')
    createBoardButton.id = 'create'
    createBoardButton.innerText = 'Create Board'
    boardDiv.appendChild(createBoardButton)
    boardDiv.className = 'left-panel'
    return boardDiv
}