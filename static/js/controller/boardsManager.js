import {dataHandler,apiPost, apiPatch} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {columnsManager} from "./columnsManager.js";
import { editBoardTitleTemplate } from "../data/dataTemplates.js";
import { createBoardButton } from "./homeManager.js";

export let boardsManager = {
    loadBoards: async function (boardId) {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            if (boardId && boardId == board.id) {
                console.log('I am here')
                document.getElementsByClassName('board')[boards.indexOf(board)].innerHTML = `<h3 data-board-id=${board.id}>${board.title}</h3>`
                await columnsManager.loadColumns(boardId)
                return
            } else {
                continue
            }
        }
        document.getElementById('root').innerHTML = ''
        createBoardButton()
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
            domManager.addEventListener(
                `h3[data-id="${board.id}"]`,
                "click",
                editBoardTitle
            );
        }
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    columnsManager.loadColumns(boardId);
    clickEvent.target.style.display = "none"
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