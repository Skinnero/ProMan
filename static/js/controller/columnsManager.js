import * as columnsFactory from "../view/html_builders/columnsFactory.mjs"
import { getColumnsByBoardId } from "../data_handler/columns.js"
import {getColumnDiv, getColumnTitle} from "../view/html_builders/columnsFactory.mjs";

export async function setColumns(board) {
    let columns = await getColumnsByBoardId(board.id)
    let boardDiv = document.getElementsByClassName('board')[0]
    if (!columns){
        setAddColumnButton(boardDiv)
        return
    }
    for (const column of columns){
        boardDiv.appendChild(columnsFactory.getColumnDiv(column))
        const columnDivs = document.querySelectorAll('.columns')[columns.indexOf(column)]
        columnDivs.appendChild(columnsFactory.getColumnTitle(column))
    }
    setAddColumnButton(boardDiv)
}

function setAddColumnButton(boardDiv) {
    let button = columnsFactory.getAddColumnButton()
    boardDiv.appendChild(button)
}

export function addSingleColumn(column){
    const board = document.getElementsByClassName('board')[0]
    const newColumn = getColumnDiv(column)
    newColumn.appendChild(getColumnTitle(column))
    board.insertBefore(newColumn, document.getElementsByClassName('button-column')[0])
    return newColumn
}

export function removeSingleColumn(removedColumnId){
    const board = document.getElementsByClassName('board')[0]
    const columns = document.getElementsByClassName('columns')
    for (const column of columns){
        if (column.dataset.id == removedColumnId){
            board.removeChild(column)
        }
    }
}

