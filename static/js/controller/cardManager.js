import {dataHandler, apiPost, apiDelete, apiPatch} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { editCardTitleTemplate, createCardTemplate } from "../data/dataTemplates.js";
import {socket} from "./websocketsManager";

export let cardsManager = {
    loadCards: async function (columnId) {
        const cards = await dataHandler.getCardsByBoardId(columnId);
        if (cards) {
            buildCards(cards, columnId)
        }
    },
};

export function buildCards(cards, columnId) {
    for (const card of cards) {
        if (columnId == card.column_id) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.column-content[data-id="${columnId}"]`, content);
            addCardListeners(card.id)
        }
    }
}

export function addCardListeners(cardId){
    domManager.addEventListener(
        `.card-title[data-id="${cardId}"]`,
        "mouseup",
        editCardTitle
    );
    domManager.addEventListener(
        `.card-title[data-id="${cardId}"]`,
        "mousedown",
        (e) => {e.preventDefault()}
    )
    domManager.addEventListener(
        `.delete-card[data-id="${cardId}"]`,
        "click",
        () => deleteCard(cardId))
    dragAndDrop(cardId)
}

function dragAndDrop(cardId) {
    const cardElement = document.querySelector(`.card[data-id="${cardId}"]`);
    cardElement.draggable = true;
    cardElement.addEventListener("dragstart", dragStartHandler);
}

function editCardTitle (clickEvent) {
    clickEvent.target.focus()
    clickEvent.target.select()
    const textarea = clickEvent.target;
    textarea.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault()
            socket.emit('update_card_title', textarea.value, textarea.dataset.id)
            apiPatch(`/api/cards/${textarea.dataset.id}`, editCardTitleTemplate(textarea.value))
            event.target.blur()
        }}
    );
}

function dragStartHandler(event) {
    const cardElement = event.target;
    event.dataTransfer.setData("text/plain", cardElement.dataset.cardId);
}

function deleteCard(cardId) {
    apiDelete(`/api/cards/${cardId}`)
    socket.emit('delete_card', cardId)
    document.querySelector(`.card[data-id='${cardId}']`).remove()
}

export function createNewCard (columnId) {
    let modal = htmlFactory(htmlTemplates.modal);
    let asd = modal('card')
    domManager.addChild("#root", asd);
    domManager.addEventListener(
        `.create`,
        "click",
        () => sendDataAndBuild(document.querySelector(".title").value, columnId)
    );

    async function sendDataAndBuild(cardName, columnId){
        document.querySelector(".modal").remove()
        await apiPost(`/api/columns/${columnId}/cards`, createCardTemplate(cardName,columnId))
        const cards = await dataHandler.getCardsByBoardId(columnId);
        buildCards([cards[cards.length - 1]], columnId)
        socket.emit('create_card', cards, columnId)
    }
}
