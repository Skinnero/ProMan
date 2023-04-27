import {dataHandler,apiPost, apiPatch, apiDelete} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { columnsManager } from "./columnsManager.js";
import { editBoardTitleTemplate, createBoardTemplate } from "../data/dataTemplates.js";
import { menuBuilder } from "./homeManager.js";



export let boardsManager = {
    // Load boards
    loadBoards: async function (boardId) {
        const boards = await dataHandler.getBoards();
        menuBuilder()
        createNavbarContent(boards)
    }
};

function createNavbarContent(boards) {
    for (let board of boards) {
        const sidebardElementBuilder = htmlFactory(htmlTemplates.sidebardElementBuilder)
        let content = sidebardElementBuilder(board.title, board.id)
        domManager.addChild(".sidebar", content);
        addNavbarListeners(board.id)
    }
}

async function buildBoard(demandId) {
    let boards = await dataHandler.getBoards();
    for (let board of boards) {
        if(board.id == demandId) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            columnsManager.loadColumns(board.id);
            addListeners(board.id)
        }
    }
}

function addNavbarListeners(boardId) {
    domManager.addEventListener(
        `li[data-id="${boardId}"]`,
        "click",
        showBoard
    );
}

function addListeners (boardId) {
    //Add event listeners for board buttons
    domManager.addEventListener(
        `h3[data-id="${boardId}"]`,
        "click",
        editBoardTitle
    );
    domManager.addEventListener(
        `.delete-board[data-delete-board-id="${boardId}"]`,
        "click",
        () => deleteBoard(boardId)
    )
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

async function deleteBoard (boardId) {
    await apiDelete(`/api/boards/${boardId}`)
    document.querySelector(`.board[data-board-id='${boardId}']`).remove()
    document.querySelector(`li[data-id='${boardId}']`).remove()
}

export async function createBoard() {
    let boardName = prompt("Enter board name.")
    await apiPost("/api/boards", createBoardTemplate(boardName))
    let boards = await dataHandler.getBoards();
    let newBoard = boards[boards.length - 1];
    const sidebardElementBuilder = htmlFactory(htmlTemplates.sidebardElementBuilder)
    let content = sidebardElementBuilder(newBoard.title, newBoard.id)
    domManager.addChild(".sidebar", content);
    domManager.addEventListener(
        `li[data-id="${newBoard.id}"]`,
        "click",
        showBoard
    );
}

function showBoard(clickEvent) {
    const demandId = clickEvent.target.dataset.id;
    const oldBoard = document.querySelector(".board")
    if (oldBoard != null) {
        oldBoard.remove()
    }
    buildBoard(demandId)
}
