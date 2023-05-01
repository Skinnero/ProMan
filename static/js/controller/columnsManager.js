import {dataHandler, apiPost, apiDelete, apiPatch} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { cardsManager, createNewCard, addCardListeners } from "./cardManager.js";
import {editColumnTitleTemplate, createColumnTemplate, editBoardTitleTemplate} from "../data/dataTemplates.js";
import {socket} from "./websocketsManager";

let dragSource

export let columnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getColumnsByBoardId(boardId);
        buildColumns(columns, boardId)
    },
};

export async function buildColumns (columns, boardId) {
    for (const column of columns) {
        if (column.board_id == boardId) {
            const columnBuilder = htmlFactory(htmlTemplates.column);
            const content = columnBuilder(column, boardId);
            domManager.addChild(`.board-content[data-id='${boardId}']`, content);
            await cardsManager.loadCards(column.id, boardId);
            addColumnListeners(column.id)
            dragAndDrop()
        }
    }
    domManager.addEventListener(
        `.create-new-column[data-id="${boardId}"]`,
        "click",
        () => createNewColumn(boardId)
    )
}

function addColumnListeners(columnId) {
    domManager.addEventListener(
        `.column-title[data-id="${columnId}"] textarea`,
        "mouseup",
        editColumnTitle);
    domManager.addEventListener(
        `.column-title[data-id="${columnId}"] textarea`,
        "mousedown",
        (e) => {e.preventDefault()}
    )
    domManager.addEventListener(
        `.delete-column[data-id="${columnId}"]`,
        "click",
        () => deleteColumn(columnId)
    );
    domManager.addEventListener(
        `.column-content[data-id="${columnId}"]`,
        "drop",
        dropHandler
    );
    domManager.addEventListener(
        `.column-content[data-id="${columnId}"]`,
        "dragover",
        dragOverHandler
    );
    domManager.addEventListener(
        `.create-new-card[data-id="${columnId}"]`,
        "click",
        () => createNewCard(columnId));
}

function dragAndDrop() {
    let cardElement = document.querySelectorAll(`.column`);
    const cardLength = cardElement.length
    cardElement = cardElement[cardLength - 1]
    cardElement.draggable = true;
    cardElement.addEventListener("dragstart", dragStartHandler);
    cardElement.addEventListener("drop", dropColumnHandler);
    cardElement.addEventListener("dragover", dragOverHandler);
}

function editColumnTitle (clickEvent) {
    clickEvent.target.focus()
    clickEvent.target.select()
    const textarea = clickEvent.target;
    textarea.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault()
            socket.emit('update_column_title', textarea.value, textarea.dataset.id)
            apiPatch(`/api/columns/${textarea.dataset.id}`, editColumnTitleTemplate(textarea.value))
            event.target.blur()
        }}
    )
}

export function createNewColumn (boardId) {
    let modal = htmlFactory(htmlTemplates.modal);
    let asd = modal('column')
    domManager.addChild("#root", asd);
    domManager.addEventListener(
        `.create`,
        "click",
        () => sendDataAndBuild(document.querySelector(".title").value, boardId)
    );

    async function sendDataAndBuild(columnName, boardId){
        document.querySelector(".modal").remove()
        await apiPost(`/api/boards/${boardId}/columns`, createColumnTemplate(columnName, boardId))
        const columns = await dataHandler.getColumnsByBoardId(boardId);
        socket.emit('create_column', columns, boardId)
        buildColumns([columns[columns.length - 1]], boardId)
    }
}

async function deleteColumn (columnId) {
    await apiDelete(`/api/columns/${columnId}`)
    socket.emit('delete_column', columnId)
    document.querySelector(`.column[data-id='${columnId}']`).remove()
}

function dropHandler(event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const targetColumn = event.currentTarget;
    const targetColumnId = targetColumn.dataset.id;
    if (dragSource.classList[0] == 'card') {
        targetColumn.appendChild(document.querySelector(`.card[data-id='${cardId}']`));
        apiPatch(`/api/cards/${cardId}`, { column_id: targetColumnId })
        socket.emit('update_card_position', cardId, targetColumnId)
    }
}

function dragOverHandler(event) {
    event.preventDefault();
}

function dragStartHandler(event) {
    dragSource = event.target
    event.dataTransfer.setData("text/plain", event.target.dataset.id)
}

async function dropColumnHandler() {
    // TODO: FIX NAME CHANGING AFTER SWAP COLUMNS
    if (dragSource.classList[0] == 'column') {
        let dragContent = this.innerHTML
        let id = this.dataset.id
        this.innerHTML = dragSource.innerHTML
        dragSource.innerHTML = dragContent
        this.dataset.id = dragSource.dataset.id
        dragSource.dataset.id = id
        addColumnListeners(dragSource.dataset.id)
        addColumnListeners(this.dataset.id)
        const columns = getColumnsOrder()
        await apiPatch(`/api/boards/${dragSource.dataset.boardId}/columns`, columns)
        let cards = document.querySelectorAll(`.column[data-id='${dragSource.dataset.id}'] .card`)
        for (let card of cards) {
            addCardListeners(card.dataset.id)
        }
        cards = document.querySelectorAll(`.column[data-id='${this.dataset.id}'] .card`)
        for (let card of cards) {
            addCardListeners(card.dataset.id)
        }
        socket.emit('update_column_position', this.dataset.id, dragSource.dataset.id)
    }
}

function getColumnsOrder() {
    const columns = document.querySelectorAll('.column')
    let columnsData = []
    let index = 1
    for (let column of columns) {
        let data = {id: column.dataset.id, order_number: index}
        columnsData.push(data)
        index ++
    }
    return columnsData
}