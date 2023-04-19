import {dataHandler,apiPost, apiPatch, apiDelete} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {columnsManager, createNewColumn} from "./columnsManager.js";
import { editBoardTitleTemplate, createBoardTemplate } from "../data/dataTemplates.js";
import { createBoardButton } from "./homeManager.js";



export let boardsManager = {
    // Load boards
    loadBoards: async function (boardId) {
        const boards = await dataHandler.getBoards();
        createBoardButton()
        createBoards(boards)
    }
};


function createBoards(boards) {
    // Create board for every board and add functionality
    for (let board of boards) {
        const boardBuilder = htmlFactory(htmlTemplates.board);
        const content = boardBuilder(board);
        domManager.addChild("#root", content);
        hideStartingButtons(board.id)
        addListeners(board.id)
    }
}

function addListeners (boardId) {
    //Add event listeners for board buttons
    domManager.addEventListener(
        `.show-board-button[data-board-id="${boardId}"]`,
        "click",
        showButtonHandler
    );
    domManager.addEventListener(
        `h3[data-id="${boardId}"]`,
        "click",
        editBoardTitle
    );
    domManager.addEventListener(
        `.hide-board-button[data-board-id="${boardId}"]`,
        "click",
        () => hideBoard(boardId)
    );
    domManager.addEventListener(
        `.delete-board[data-delete-board-id="${boardId}"]`,
        "click",
        () => deleteBoard(boardId)
    )
}

function showButtonHandler(clickEvent) {
    //Show content of board
    const boardId = clickEvent.target.dataset.boardId;
    columnsManager.loadColumns(boardId);
    clickEvent.target.style.display = "none"
    document.querySelector(`button[data-delete-board-id='${boardId}']`).style.display=''
    document.querySelector(`button[data-new-column-board-id='${boardId}']`).style.display=''
    document.querySelector(`.hide-board-button[data-board-id='${boardId}']`).style.display=''
}

function editBoardTitle (clickEvent) {
    const boardId = clickEvent.target.dataset.id
    const boardTitle = clickEvent.target;
    const input = document.createElement("input")
    input.value = boardTitle.innerText;
    boardTitle.replaceWith(input);
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          const newTitle = input.value;
          input.replaceWith(boardTitle);
          boardTitle.innerText = newTitle;
          apiPatch(`/api/boards/${boardId}`, editBoardTitleTemplate(newTitle))
        }}
    );
}

function hideStartingButtons(boardId) {
    document.querySelector(`button[data-delete-board-id='${boardId}']`).style.display='None'
    document.querySelector(`button[data-new-column-board-id='${boardId}']`).style.display='None'
    document.querySelector(`.hide-board-button[data-board-id='${boardId}']`).style.display='None'
}

function hideBoard(boardId) {
    const columns = document.querySelectorAll(`.column[data-board-id='${boardId}']`)
    columns.forEach(column => {column.remove()});
    document.querySelector(`button[data-delete-board-id='${boardId}']`).style.display='None'
    document.querySelector(`button[data-new-column-board-id='${boardId}']`).style.display='None'
    document.querySelector(`.hide-board-button[data-board-id='${boardId}']`).style.display='None'
    document.querySelector(`.show-board-button[data-board-id='${boardId}']`).style.display=''
}

async function deleteBoard (boardId) {
    await apiDelete(`/api/boards/${boardId}`)
    document.querySelector(`.board[data-board-id='${boardId}']`).remove()
}

export async function createBoard() {
    let boardName = prompt("Enter board name.")
    await apiPost("/api/boards", createBoardTemplate(boardName))
    const board = await dataHandler.getBoards();
    createBoards([board[board.length-1]])   
}