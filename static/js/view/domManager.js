import * as boardsManager from '../controller/boardsManager.js'
import * as boardsHandler from '../data_handler/boards.js'
import * as columnsManager from '../controller/columnsManager.js'
import * as util from './util.js'

export async function setBoardsButtons(){
    await boardsManager.setBoards()
    const tags = document.querySelectorAll('.left-panel textarea')
    for (let tag of tags){;
        tag.addEventListener('blur', editBoardTitle)
        tag.addEventListener('keydown', editBoardTitle)
    }
}   

function editBoardTitle(e){
    const boardId = e.target.dataset.id
    const data = {name: e.target.value}
    if (e.keyCode === 13){
        e.preventDefault()
        boardsHandler.updateBoard(boardId, data)
    } else if (e.type == 'blur'){
        boardsHandler.updateBoard(boardId, data)
    }
}


function setBoard(){
    console.log('Im that Board')
}
