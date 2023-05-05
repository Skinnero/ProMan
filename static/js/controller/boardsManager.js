import {dataHandler, apiPost, apiPatch, apiDelete} from "../data/dataHandler.js";
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
    domManager.addEventListener(
        '.view-history',
        'click',
        () => checkHistory(boardId)
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
            textarea.innerHTML = textarea.value
            apiPatch(`/api/boards/${textarea.dataset.id}`, editBoardTitleTemplate(textarea.value))
            socket.emit('update_board_title', textarea.dataset.id, textarea.value)
            event.target.blur()
        }}
    )
}

async function checkHistory (boardId) {
    const archivedCards = await dataHandler.getArchivedCard(boardId)
    const historyModal = htmlFactory(htmlTemplates.historyCardsModal)
    domManager.addChild('body', historyModal())
    archivedCards.forEach(card => {
        const cardRow = htmlFactory(htmlTemplates.archivedCardBuilder)
        domManager.addChild('.history-modal table', cardRow(card))
    })
    window.onclick = (e) => {
        if (e.target == document.querySelector('.history-modal')) {
            document.querySelector('.history-modal').remove()
        }
    }
}

async function deleteBoard (boardId) {
    await apiDelete(`/api/boards/${boardId}`)
    socket.emit('delete_board', boardId)
    document.querySelector(`.board[data-id='${boardId}']`).remove()
    document.querySelector(`li[data-id='${boardId}']`).remove()
}

export function createBoard() {
    let modal = htmlFactory(htmlTemplates.modal);
    let content = modal('board')
    domManager.addChild("#root", content);
    content = new DOMParser().parseFromString(`<label "for="id="visibility"" style="color: white;">Public board</label>`, 'text/html');
    let div = content.body.firstChild;
    document.querySelector('.modal-content').insertBefore(div, document.querySelector('.create'))
    content = new DOMParser().parseFromString(`<input class="choice" type="checkbox" id="visibility"></input>`, 'text/html');
    div = content.body.firstChild;
    document.querySelector('.modal-content').insertBefore(div, document.querySelector('.create'))
    domManager.addEventListener(
        `.create`,
        "click",
        () => sendDataAndBuild(document.querySelector(".title").value)
    );
    domManager.addEventListener(
        `.cancel`,
        "click",
        cancelCreate
    );

    async function sendDataAndBuild(boardName){
        let visibility = document.querySelector(".choice").checked
        if (document.cookie == '' && !visibility) {
            alert('To create private board you have to log in')
            return
        }
        document.querySelector(".modal").remove()
        if (!visibility) {
            await apiPost("/api/boards", createBoardTemplate(boardName, true))
        } else {
            await apiPost("/api/boards", createBoardTemplate(boardName, false))
        }
        let boards = await dataHandler.getBoards();
        let newBoard = boards[boards.length - 1];
        const sidebarElementBuilder = htmlFactory(htmlTemplates.sidebarElementBuilder)
        let content = sidebarElementBuilder(newBoard.title, newBoard.id)
        if (!visibility) {
            let privateContent = new DOMParser().parseFromString(content, 'text/html');
            let div = privateContent.body.firstChild;
            document.querySelector('.sidebar').insertBefore(div, document.querySelector('.public-boards'))


        } else {
            domManager.addChild(".sidebar", content);
        }
        domManager.addEventListener(
            `li[data-id="${newBoard.id}"]`,
            "click",
            showBoard
        );
    }
    function cancelCreate () {
        document.querySelector(".modal").remove()
    }
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