export const htmlTemplates = {
    board: 1,
    column: 2,
    card: 3,
    buttonBuilder: 4,
    navbarBuilder: 5,
    sidebarBuilder: 6,
    sidebarElementBuilder: 7,
    modal: 8,
    historyCardsModal: 9,
    archivedCardBuilder: 10,
    registerModal: 11,
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.column]: columnBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.sidebarElementBuilder]: sidebarElementBuilder,
    [htmlTemplates.modal]: modal,
    [htmlTemplates.historyCardsModal]: historyCardsModal,
    [htmlTemplates.archivedCardBuilder]: archivedCardBuilder,
    [htmlTemplates.registerModal]: registerModal,
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }
    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<div class="board" data-id=${board.id}>
                <div class="board-title" data-id=${board.id}>
                    <textarea data-id=${board.id}>${board.title}</textarea>
                </div>
                    <div class="board-content" data-id=${board.id}>
                </div>
                <div class="board-buttons">
                    <button class="create-new-column" data-id=${board.id}>Create new column</button>
                    <button class="view-history" data-id=${board.id}>View history</button>
                    <button class="delete-board" data-id=${board.id}>Delete board</button>
                </div>
            </div>`;
}

function columnBuilder(column, boardId) {
    return `<div class="column" data-id="${column.id}" data-board-id="${boardId}">
                <div class="column-title" data-id="${column.id}">
                    <textarea data-id=${column.id}>${column.title}</textarea>
                </div>
                <div class="column-buttons" data-id="${column.id}">
                    <button class="delete-column" data-id="${column.id}">Delete column</button><br>
                    <button class="create-new-card" data-id="${column.id}">Create new card</button>
                </div>
                <div class="column-content" data-id="${column.id}">
                </div>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-id="${card.id}" >
                    <textarea class="card-title" data-id="${card.id}">${card.title}</textarea>
                    <button class="delete-card" data-id="${card.id}">Delete card</button>
            </div>`;
}

function sidebarElementBuilder(boardName, boardId) {
    return `<li data-id="${boardId}">
                <h5 data-id="${boardId}">${boardName}</h5>
            </li>`
}

function modal(title) {
    return  `<div class="modal">
                <div class="modal-content">
                <h4>Create ${title}</h4>
                <input class="title">
                <button class="create">Create</button>
                <button class="cancel">Cancel</button>
                </div>
            </div>`
}

function historyCardsModal() {
    return `<div class="history-modal">
                <div class="history-modal-content">
                    <table>
                        <tr>
                            <th style="width: 10%">Id</th>
                            <th style="width: 80%">Title</th>
                            <th style="width: 10%">Submission time</th>
                        </tr>
                    </table>
                </div> 
            </div>`
}

function archivedCardBuilder(card) {
    return `<tr>
                <th>${card.id}</th>
                <th>${card.title}</th>
                <th>${card['submission_time']}</th>
            </tr>
    `
}

function registerModal() {
    return  `<div class="modal">
                <div class="modal-content">
                    <h4>Register</h4>
                    <a style="color: white;">Login</a>
                    <input class="login-register"></input>
                    <br>
                    <a style="color: white;">Password</a>
                    <input class="password-register" type="password"></input>
                    <br>
                    <a style="color: white;">Confirm password</a>
                    <input class="confirm-password-register" type="password"></input>
                    <br>
                    <button class="confirm-register">Register</button>
                    <button class="cancel">Cancel</button>
                </div>
            </div>`

}
