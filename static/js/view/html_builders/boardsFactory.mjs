export function getDivForBoards(board){
    const boardsDiv = document.createElement('div')
    boardsDiv.className = 'board-management'
    boardsDiv.dataset.id = board.id
    boardsDiv.appendChild(getShowBoardButton(board))
    boardsDiv.appendChild(getDeleteBoardButton(board))
    return boardsDiv
}
export function getShowBoardButton(board){
    const showBoardButton = document.createElement('button')
    showBoardButton.className = 'show-board'
    showBoardButton.innerText = board.title
    showBoardButton.dataset.id = board.id
    return showBoardButton
}
export function getDeleteBoardButton(board){
    const deleteBoardButton = document.createElement('button')
    deleteBoardButton.className = 'delete-board'
    deleteBoardButton.innerText = '-'
    deleteBoardButton.dataset.id = board.id
    return deleteBoardButton
}

export function getBoardOnMainPage(){
    const mainBoardDiv = document.createElement('div')
    mainBoardDiv.className = 'board'
    return mainBoardDiv
}

export function getBoardTitle(board){
    const boardTitleDiv = document.createElement('div')
    const textareaTitle = document.createElement('textarea')
    boardTitleDiv.className = 'board-title'
    textareaTitle.dataset.id = board.id
    textareaTitle.value = board.title
    boardTitleDiv.appendChild(textareaTitle)
    return boardTitleDiv
}
