import {dataHandler,apiPost, apiPatch, apiDelete} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { columnsManager } from "./columnsManager.js";
import { editBoardTitleTemplate, createBoardTemplate } from "../data/dataTemplates.js";
import { menuListeners } from "./homeManager.js";
import {socket} from "./websocketsManager";


export const boardsManager = {
    // Load boards
    loadBoards: async function () {
        menuListeners()
        addShowBoardListeners()
    }
};

async function buildBoard(newBoardId) {
    const boards = await dataHandler.getBoards();
    for (const board of boards) {
        if(board.id == newBoardId) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            await columnsManager.loadColumns(board.id);
            addListeners(board.id)
        }
    }
}

function addShowBoardListeners() {
    const elements = document.querySelectorAll('.sidebar-board')
    for (let element of elements) {
        domManager.addEventListener(
            `.sidebar-board[data-id="${element.dataset.id}"]`,
            "click",
            showBoard
        )
    }
}

function addListeners (boardId) {
    //Add event listeners for board buttons
    domManager.addEventListener(
        `.board-title textarea`,
        "mouseup",
        editBoardTitle
    )
    domManager.addEventListener(
        `.board-title textarea`,
        "mousedown",
        (e) => {e.preventDefault()}
    )
    domManager.addEventListener(
        `.delete-board[data-id="${boardId}"]`,
        "click",
        () => deleteBoard(boardId)
    )
}

function editBoardTitle (clickEvent) {
    clickEvent.target.focus()
    clickEvent.target.select()
    const textarea = clickEvent.target;
    textarea.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault()
            document.querySelector(`.sidebar-board[data-id="${textarea.dataset.id}"] h5`).innerText = textarea.value
            apiPatch(`/api/boards/${textarea.dataset.id}`, editBoardTitleTemplate(textarea.value))
            socket.emit('update_board_title', textarea.dataset.id, textarea.value)
            event.target.blur()
        }}
    )
}

async function deleteBoard (boardId) {
    await apiDelete(`/api/boards/${boardId}`)
    socket.emit('delete_board', boardId)
    document.querySelector(`.board[data-id='${boardId}']`).remove()
    document.querySelector(`li[data-id='${boardId}']`).remove()
}

export async function createBoard() {
    // TODO: modal
    let boardName = prompt("Enter board name.")
    await apiPost("/api/boards", createBoardTemplate(boardName))
    let boards = await dataHandler.getBoards();
    let newBoard = boards[boards.length - 1];
    const sidebarElementBuilder = htmlFactory(htmlTemplates.sidebarElementBuilder)
    let content = sidebarElementBuilder(newBoard.title, newBoard.id)
    domManager.addChild(".sidebar", content);
    domManager.addEventListener(
        `li[data-id="${newBoard.id}"]`,
        "click",
        showBoard
    )
}

function showBoard(clickEvent) {
    const newBoardId = clickEvent.target.dataset.id;
    const oldBoard = document.querySelector(".board")
    socket.emit('join', newBoardId)
    if (oldBoard){
        socket.emit('leave', oldBoard.dataset.id)
        oldBoard.remove()
    }
    buildBoard(newBoardId)
}