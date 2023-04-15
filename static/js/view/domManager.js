import * as boardsManager from '../controller/boardsManager.js'
import * as boardsHandler from '../data_handler/boards.js'
import * as columnsManager from '../controller/columnsManager.js'
import * as columnsHandler from '../data_handler/columns.js'
import * as cardsManager from '../controller/cardsManager.js'
import * as cardsHandler from '../data_handler/cards.js'
import * as dragAndDrop from './dragAndDrop.js'

export async function setBoardsButtons(){
    await boardsManager.setBoards()
    let boardOnMainPage

    function setDeleteBoardButtons(){
        const deleteButtons = document.querySelectorAll('.board-management .delete-board')
        for (const button of deleteButtons){
            button.addEventListener('click', () => {
                boardsHandler.deleteBoard(button.dataset.id)
                setBoardsButtons()
            })
        }
    }

    function setEditBoardTitle(){
        const editTextarea = document.querySelectorAll('.board-title textarea')[0]
        const eventHandler = (e) => {
            const data = {name: e.target.value}
            if (e.keyCode === 13){
                e.preventDefault()
                boardsHandler.updateBoard(boardOnMainPage.id , data)
                boardsManager.changeBoardTitleOnLeftPanel(boardOnMainPage.id, data)
                e.target.blur()
            } else if (e.type === 'blur'){
                boardsHandler.updateBoard(boardOnMainPage.id , data)
                boardsManager.changeBoardTitleOnLeftPanel(boardOnMainPage.id, data)
            }
        }
        editTextarea.addEventListener('keydown', eventHandler)
        editTextarea.addEventListener('blur', eventHandler)
    }

    function setCreateBoardButton(){
        const newBoard = {name: 'test', user_id: 3}
        const createBoardButton = document.getElementById('create-board')
        createBoardButton.addEventListener('click', async ()=>{
            await boardsHandler.createBoard(newBoard)
            await setBoardsButtons()
        })
    }

    function setShowBoardButton(){
        const showButtons = document.querySelectorAll('.board-management .show-board')
        const clickHandler = async (e) => {
            boardOnMainPage = await boardsHandler.getBoard(e.target.dataset.id)
            boardsManager.setBoardOnMainPage(boardOnMainPage)
            await columnsManager.setColumns(boardOnMainPage)
            await cardsManager.setCardsOnColumns()
            await setBoardsButtons()
            setEditBoardTitle()
            setColumnsDom(boardOnMainPage)
            showButtons.forEach(button => {
                button.removeEventListener('click', clickHandler)
            })
        }
        showButtons.forEach(button => {
            button.addEventListener('click', clickHandler)
        })
    }
    setDeleteBoardButtons()
    setShowBoardButton()
    setCreateBoardButton()
}

function setColumnsDom(board){
    function editTitle(){
        const columns = document.querySelectorAll('.column-title textarea')
        const editEventHandler = (e) => {
            const columnId = e.target.dataset.id
            const data = {name: e.target.value}
            if (e.keyCode === 13){
                e.preventDefault()
                columnsHandler.updateColumn(columnId, data)
                e.target.blur()
            } else if (e.type === 'blur'){
                columnsHandler.updateColumn(columnId, data)
            }
        }
        columns.forEach(column => {
            column.addEventListener('keydown', editEventHandler)
            column.addEventListener('blur', editEventHandler)
        })
    }
    function createColumn(){
        // TODO: Add to element instead of reset EVERYWHERE
        const createButton = document.getElementsByClassName('create-column')[0]
        const data = {name: "NEW"}
        createButton.addEventListener('click', async () => {
            await columnsHandler.createColumn(board.id, data)
            boardsManager.setBoardOnMainPage(board)
            await columnsManager.setColumns(board)
            await cardsManager.setCardsOnColumns()
            setColumnsDom(board)
        })
    }
    function deleteColumn(){
        const deleteButtons = document.getElementsByClassName('delete-column')
        for (const button of deleteButtons) {
            button.addEventListener('click', async (e) => {
                await columnsHandler.deleteColumn(e.target.dataset.id)
                boardsManager.setBoardOnMainPage(board)
                await columnsManager.setColumns(board)
                await cardsManager.setCardsOnColumns()
                setColumnsDom(board)
            })
        }
    }
    editTitle()
    createColumn()
    deleteColumn()
    setCardsDom(board)
}

function setCardsDom(board){
    function createCard(){
        const createButtons = document.getElementsByClassName('create-card')
        for (const button of createButtons){
            button.addEventListener('click', async () => {
                const data = {message: "NEW", column_id: button.dataset.id}
                await cardsHandler.createCard(button.dataset.id, data)
                boardsManager.setBoardOnMainPage(board)
                await columnsManager.setColumns(board)
                await cardsManager.setCardsOnColumns()
                setColumnsDom(board)
            })
        }
    }
    function deleteCard(){
        const cards = document.getElementsByClassName('delete-card')
        for (const card of cards){
            card.addEventListener('click', async () => {
                await cardsHandler.deleteCard(card.dataset.id)
                boardsManager.setBoardOnMainPage(board)
                await columnsManager.setColumns(board)
                await cardsManager.setCardsOnColumns()
                setColumnsDom(board)
            })
        }
    }
    function editCard(){
        const cards = document.querySelectorAll('.cards textarea')
        const editEventHandler = (e) => {
            const cardId = e.target.dataset.id
            const data = {message: e.target.value}
            if (e.keyCode === 13){
                e.preventDefault()
                cardsHandler.updateCard(cardId, data)
                e.target.blur()
            } else if (e.type === 'blur'){
                cardsHandler.updateCard(cardId, data)
            }
        }

        for (const card of cards){
            card.addEventListener('keydown', editEventHandler)
            card.addEventListener('blur', editEventHandler)
        }
    }

    deleteCard()
    createCard()
    editCard()
}

function setUsersDom(){

}