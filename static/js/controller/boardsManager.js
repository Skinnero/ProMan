import * as boardsFactory from "../view/html_builders/boardsFactory.mjs"
import { getBoards } from "../data_handler/boards.js"

export async function setBoards() {
    setLeftPanelOnWebsite()
    const boards = await getBoards()
    const leftPanel = document.getElementById('left-panel')
    leftPanel.appendChild(boardsFactory.getCreateBoardButton())
    for (const board of boards){
        leftPanel.appendChild(boardsFactory.getDivForBoards(board))
    }
}

export function changeBoardTitleOnLeftPanel(boardId, data){
    const boards = document.getElementsByClassName('show-board')
    for (const board of boards){
        if (board.dataset.id == boardId){
            board.innerText = data.name
        }
    }
}


function setLeftPanelOnWebsite(){
    if (document.getElementById('left-panel') != null){
        document.getElementById('left-panel').innerHTML = ''
        return
    }
    document.body.appendChild(boardsFactory.getLeftPanel())
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


