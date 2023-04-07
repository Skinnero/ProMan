import { getBoards } from "../data_handler/boards.js";
import * as boardsFactory from "../view/html_builders/boardsFactory.mjs"

export async function setBoards() {
    const boards = await getBoards()
    setDivOnWebsite()
    let leftPanel = ``
    for (const board of boards) {
        leftPanel += boardsFactory.getBoardsList(board)
    }
    document.getElementsByClassName('left-panel')[0].innerHTML += leftPanel
}

function setDivOnWebsite(){
    let leftPanel = boardsFactory.getBoardsDiv()
    document.body.appendChild(leftPanel)
}
