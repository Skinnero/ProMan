import * as boardsFactory from "../view/html_builders/boardsFactory.mjs"
import { getBoards } from "../data_handler/boards.js"

export function changeBoardTitleOnLeftPanel(boardId, data){
    const boards = document.getElementsByClassName('show-board')
    for (const board of boards){
        if (board.dataset.id == boardId){
            board.innerText = data.title
        }
    }
}
export function setBoardOnMainPage(board){
    if (document.getElementsByClassName('board')[0] != null){
        document.getElementsByClassName('board')[0].innerHTML = ''
        document.getElementsByClassName('board')[0].appendChild(boardsFactory.getBoardTitle(board))
        return
    }
    document.body.appendChild(boardsFactory.getBoardOnMainPage())
    document.getElementsByClassName('board')[0].appendChild(boardsFactory.getBoardTitle(board))
}

export function removeSingleBoard(removedBoardId, boardOnMainPage){
    const leftPanel = document.getElementById('left-panel')
    const boardDivs = document.querySelectorAll('#left-panel .board-management')
    for (const boardDiv of boardDivs){
        if (boardDiv.dataset.id == removedBoardId){
            leftPanel.removeChild(boardDiv)
            if (boardOnMainPage){
                if (boardDiv.dataset.id == boardOnMainPage.id) {
                    document.getElementsByClassName('board')[0].innerHTML = ''
                }
            }
        }
    }
}

export function addSingleBoard(newBoard){
    const leftPanel = document.getElementById('left-panel')
    newBoard = boardsFactory.getDivForBoards(newBoard)
    leftPanel.appendChild(newBoard)
    return newBoard
}