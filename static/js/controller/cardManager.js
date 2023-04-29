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
        `h4[data-id="${cardId}"]`,
        "click",
        editCardTitle
    );
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
    const cardTitle = clickEvent.target;
    const input = document.createElement("input")
    const cardId = clickEvent.target.dataset.id
    input.value = cardTitle.innerText;
    cardTitle.replaceWith(input);
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const newTitle = input.value;
            input.replaceWith(cardTitle);
            cardTitle.innerText = newTitle;
            socket.emit('update_card_title', cardTitle.innerText, cardId)
            apiPatch(`/api/cards/${cardId}`, editCardTitleTemplate(newTitle))
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

export async function createNewCard (columnId) {
    const cardName = prompt("Enter card name.")
    await apiPost(`/api/columns/${columnId}/cards`, createCardTemplate(cardName,columnId))
    const cards = await dataHandler.getCardsByBoardId(columnId);
    socket.emit('create_card', cards, columnId)
    buildCards([cards[cards.length - 1]], columnId)
}
