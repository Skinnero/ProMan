import * as boardsManager from '../controller/boardsManager.js'
import * as boardsHandler from '../data_handler/boards.js'
import * as columnsManager from '../controller/columnsManager.js'
import * as columnsHandler from '../data_handler/columns.js'
import * as cardsManager from '../controller/cardsManager.js'
import * as cardsHandler from '../data_handler/cards.js'
import * as usersManager from '../controller/usersManager.js'
import * as usersHandler from '../data_handler/users.js'
import {socket} from '../websocket.js'
import {logInUser} from "../data_handler/users.js";
// TODO: Refactor all event listeners for a better clarity

export async function setBoardsButtons(){
    let boardOnMainPage = {}

    function setDeleteBoardButtons(button){
        const eventHandler = (button) => {
                boardsHandler.deleteBoard(button.dataset.id)
                boardsManager.removeSingleBoard(button.dataset.id, boardOnMainPage)
            }
        if (!button){
            const deleteButtons = document.querySelectorAll('.board-management .delete-board')
            for (const button of deleteButtons){
                button.addEventListener('click', () => {eventHandler(button)})
            }
        } else {
            button.addEventListener('click', () => {eventHandler(button)})
        }
    }

    function setEditBoardTitle(){
        const editTextarea = document.querySelectorAll('.board-title textarea')[0]
        const eventHandler = (e) => {
            const data = {title: e.target.value}
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
        const createBoardButton = document.getElementById('create-board')
        createBoardButton.addEventListener('click', async ()=>{
            let newBoard = {title: 'test', user_id: 3}
            newBoard = await boardsHandler.createBoard(newBoard)
            newBoard = boardsManager.addSingleBoard(newBoard)
            setDeleteBoardButtons(newBoard.getElementsByClassName('delete-board')[0])
            setShowBoardButton(newBoard.getElementsByClassName('show-board')[0])
            socket.emit('message', 'Board Created')
        })
    }

    function setShowBoardButton(button){
        const eventHandler = async (e, showButtons) => {
            if (boardOnMainPage.hasOwnProperty('id')){
                socket.emit('leave', boardOnMainPage.id)
            }
            boardOnMainPage = await boardsHandler.getBoard(e.target.dataset.id)
            boardsManager.setBoardOnMainPage(boardOnMainPage)
            await columnsManager.setColumns(boardOnMainPage)
            await cardsManager.setCardsOnColumns()
            setEditBoardTitle()
            setColumnsDom(boardOnMainPage)
            socket.emit('join', boardOnMainPage.id)
            if (!showButtons.length){
                showButtons.removeEventListener('click', eventHandler)
            } else {
                showButtons.forEach(button => {
                    button.removeEventListener('click', eventHandler)
                })
            }
        }
        if (!button){
            const showButtons = document.querySelectorAll('.board-management .show-board')
            showButtons.forEach(button => {
                button.addEventListener('click', (e) => {eventHandler(e, showButtons)})
            })
        } else {
            button.addEventListener('click', (e) => {eventHandler(e, button)})
        }
    }
    setDeleteBoardButtons()
    setShowBoardButton()
    setCreateBoardButton()
}

function setColumnsDom(board){
    function editTitle(column){
        const editEventHandler = (e) => {
            const columnId = e.target.dataset.id
            const data = {title: e.target.value}
            if (e.keyCode === 13){
                e.preventDefault()
                columnsHandler.updateColumn(columnId, data)
                e.target.blur()
            } else if (e.type === 'blur'){
                columnsHandler.updateColumn(columnId, data)
            }
        }
        if (column){
            column.addEventListener('keydown', editEventHandler)
            column.addEventListener('blur', editEventHandler)
        } else {
            const columns = document.querySelectorAll('.column-title textarea')
            columns.forEach(column => {
                column.addEventListener('keydown', editEventHandler)
                column.addEventListener('blur', editEventHandler)
            })
        }
    }
    function createColumn(){
        const createButton = document.getElementsByClassName('create-column')[0]
        const data = {title: "NEW"}
        createButton.addEventListener('click', async () => {
            let newColumn = await columnsHandler.createColumn(board.id, data)
            newColumn = columnsManager.addSingleColumn(newColumn)
            deleteColumn(newColumn.getElementsByClassName('delete-column')[0])
            editTitle(newColumn.getElementsByTagName('textarea')[0])
            socket.emit('create_column', newColumn.outerHTML)
            const createCardButton = cardsManager.setCardsOnSingleColumn(newColumn)
            cardsDom.createCard(createCardButton.getElementsByClassName('create-card')[0])
        })
    }
    function deleteColumn(column){

        const eventHandler = async (e) => {
            await columnsHandler.deleteColumn(e.target.dataset.id)
            columnsManager.removeSingleColumn(e.target.dataset.id)
        }
        if (column){
                column.addEventListener('click', eventHandler)
        } else {
            const deleteButtons = document.getElementsByClassName('delete-column')
            for (const button of deleteButtons) {
                button.addEventListener('click', eventHandler)
            }
        }
    }
    editTitle()
    createColumn()
    deleteColumn()
    cardsDom.createCard()
    cardsDom.deleteCard()
    cardsDom.editCard()
}

const cardsDom = {
    createCard: (button) => {
        const eventHandler = async (button) => {
            let newCard = {title: "NEW", column_id: button.dataset.id}
            newCard = await cardsHandler.createCard(button.dataset.id, newCard)
            newCard = cardsManager.addSingleCard(newCard)
            cardsDom.deleteCard(newCard.getElementsByClassName('delete-card')[0])
            cardsDom.editCard(newCard.getElementsByTagName('textarea')[0])
        }
        if (!button) {
            const createButtons = document.getElementsByClassName('create-card')
            for (const button of createButtons){
                button.addEventListener('click', () => {eventHandler(button)})
            }
        } else {
            button.addEventListener('click', () => {eventHandler(button)})
        }

    },
    deleteCard: (button) => {
        const eventHandler = async (card) => {
            await cardsHandler.deleteCard(card.dataset.id)
            cardsManager.removeSingleCard(card.dataset.id)
        }
        if (!button){
            const cards = document.getElementsByClassName('delete-card')
            for (const card of cards) {
                card.addEventListener('click', () => {eventHandler(card)})
            }
        } else {
            button.addEventListener('click', () => {eventHandler(button)})
        }
    },
    editCard: (button) => {
        const editEventHandler = (e) => {
            const cardId = e.target.dataset.id
            const data = {title: e.target.value}
            if (e.keyCode === 13){
                e.preventDefault()
                cardsHandler.updateCard(cardId, data)
                e.target.blur()
            } else if (e.type === 'blur'){
                cardsHandler.updateCard(cardId, data)
            }
        }
        if (!button) {
            const cards = document.querySelectorAll('.cards textarea')
            for (const card of cards) {
                card.addEventListener('keydown', editEventHandler)
                card.addEventListener('blur', editEventHandler)
            }
        } else {
                button.addEventListener('keydown', editEventHandler)
                button.addEventListener('blur', editEventHandler)
        }
    },
}

export function setUsersDom(){
    usersManager.setUserModal()
    usersManager.setUserModal()

    function setLogInButton(){
        const logInButton = document.getElementById('login')
        if (logInButton) {
            logInButton.addEventListener('click', () => {
                const modal = document.getElementsByClassName('modal')[0]
                modal.style.display = 'block'
                usersManager.getLogIn()
                window.onclick = (e) => {
                    if (e.target == modal) {
                        modal.style.display = 'none'
                    }
                }
            })
            document.getElementsByTagName('form')[0].addEventListener('submit', async (e) => {
                e.preventDefault()
                const modalContent = document.getElementsByClassName('modal-content')[0]
                const modal = document.getElementsByClassName('modal')[0]
                const inputs = document.querySelectorAll('form input')
                const userData = {name: inputs[0].value, password: inputs[1].value}
                if (await usersHandler.logInUser(userData)) {
                    modal.style.display = 'none'
                    window.location = '/'
                } else {
                    if (document.querySelectorAll('.modal-content p')[0]) {
                        document.querySelectorAll('.modal-content p')[0].innerHTML = "Wrong Username or Password!"
                    } else {
                        const p = document.createElement('p')
                        p.innerHTML = "Wrong Username or Password!"
                        modalContent.insertBefore(p, modalContent.firstChild)
                    }
                }
            })
        }
    }
    function setSignUpButton(){
        const signUpButton = document.getElementById('signup')
        if (signUpButton) {
            signUpButton.addEventListener('click', () => {
                const modal = document.getElementsByClassName('modal')[1]
                modal.style.display = 'block'
                usersManager.getSignUp()
                window.onclick = (e) => {
                    if (e.target == modal) {
                        modal.style.display = 'none'
                    }
                }
            })
            document.getElementsByTagName('form')[1].addEventListener('submit', async (e) => {
                e.preventDefault()
                const modalContent = document.getElementsByClassName('modal-content')[1]
                const modal = document.getElementsByClassName('modal')[1]
                const inputs = document.querySelectorAll('form input')
                const userData = {name: inputs[2].value, password: inputs[3].value}
                if (await usersHandler.singUpUser(userData)) {
                    modal.style.display = 'none'
                    window.location = '/'
                } else {
                    if (document.querySelectorAll('.modal-content p')[0]) {
                        document.querySelectorAll('.modal-content p')[0].innerHTML = "User with that name already exist"
                    } else {
                        const p = document.createElement('p')
                        p.innerHTML = "User with that name already exist"
                        modalContent.insertBefore(p, modalContent.firstChild)
                    }
                }
            })
        }
    }
    function setLogOutButton() {
        const logOutButton = document.getElementById('logout')
        if (logOutButton){
            logOutButton.addEventListener('click', async () => {
                await usersHandler.logOutUser()
                window.location = '/'
            })
        }
    }
    setLogInButton()
    setSignUpButton()
    setLogOutButton()
}
