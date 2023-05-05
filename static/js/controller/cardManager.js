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
            let heightSrc = document.querySelector(`.card-title[data-id="${card.id}"]`).scrollHeight
            if (heightSrc != 34) {
                document.querySelector(`.card-title[data-id="${card.id}"]`).style.height = `${heightSrc}px`
            }
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
    const textarea = clickEvent.target;
    textarea.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault()
            textarea.innerHTML = textarea.value
            socket.emit('update_card_title', textarea.value, textarea.dataset.id)
            apiPatch(`/api/cards/${textarea.dataset.id}`, editCardTitleTemplate(textarea.value))
            event.target.blur()
        }
    })
    textarea.addEventListener('keyup', (e) => {
        textarea.style.height = '30px'
        let height = e.target.scrollHeight
        textarea.style.height = `${height}px`
    })
}

function dragStartHandler(event) {
    const cardElement = event.target;
    event.dataTransfer.setData("text/plain", cardElement.dataset.id);
}

function deleteCard(cardId) {
    apiDelete(`/api/cards/${cardId}`)
    socket.emit('delete_card', cardId)
    document.querySelector(`.card[data-id='${cardId}']`).remove()
}

export function createNewCard (columnId) {
    let modal = htmlFactory(htmlTemplates.modal);
    let content = modal('card')
    domManager.addChild("#root", content);
    domManager.addEventListener(
        `.create`,
        "click",
        () => sendDataAndBuild(document.querySelector(".title").value, columnId)
    );
    domManager.addEventListener(
        `.cancel`,
        "click",
        cancelCreate
    )
    async function sendDataAndBuild(cardName, columnId){
        console.log('adsf')
        document.querySelector(".modal").remove()
        await apiPost(`/api/columns/${columnId}/cards`, createCardTemplate(cardName,columnId))
        const cards = await dataHandler.getCardsByBoardId(columnId);
        socket.emit('create_card', cards, columnId)
        buildCards([cards[cards.length - 1]], columnId)
    }
    function cancelCreate () {
        document.querySelector(".modal").remove()
    }
}
