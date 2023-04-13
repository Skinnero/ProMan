import * as columnsFactory from "../view/html_builders/columnsFactory.mjs"
import { getColumnsByBoardId } from "../data_handler/columns.js"

export async function setColumns(board) {
    let columns = await getColumnsByBoardId(board.id)
    let boardDiv = document.getElementsByClassName('board')[0]
    if (!columns){
        setAddColumnButton(boardDiv)
        return
    }
    for (const column of columns){
        boardDiv.appendChild(columnsFactory.getColmunDiv(column))
        const columnDivs = document.querySelectorAll('.columns')[columns.indexOf(column)]
        columnDivs.appendChild(columnsFactory.getColumnTitle(column))
    }
    setAddColumnButton(boardDiv)
}

function setAddColumnButton(boardDiv) {
    let buttton = columnsFactory.getAddColumnButton()
    boardDiv.appendChild(buttton)
}

