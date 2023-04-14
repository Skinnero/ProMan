export const htmlTemplates = {
    board: 1,
    column: 2,
    card: 3,
    buttonBuilder: 4,
    newCard: 5,
    newColumn: 6,
    deleteBoard: 7,
    deleteColumn: 8,
    deleteCard: 9,
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.column]: columnBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.newBoardButton]: buttonBuilder,
    [htmlTemplates.newCard]: cardButtonBuilder,
    [htmlTemplates.newColumn]: columnButtonBuilder,
    [htmlTemplates.deleteBoard]: boardDeleteButtonBuilder,
    [htmlTemplates.deleteColumn]: columnDeleteButtonBuilder,
    [htmlTemplates.deleteCard]: cardDeleteButtonBuilder,
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
    return `<div class="board-container">
                <div class="board" data-board-id=${board.id}>
                <h3 data-id=${board.id}>${board.title}</h3>
                </div>
                <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
            </div>`;
}

function columnBuilder(column) {
    return `<div class="column" data-id="${column.id}">
    <h4 data-id=${column.id}>${column.title}</h4>
    </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" >
    <h4 data-id="${card.id}">${card.title}</h4
    </div>`;
}

function buttonBuilder() {
    return `<button class="create-board-button">Create Board</button>`;
  }

function cardButtonBuilder(columnId) {
    return `<br><button class="create-new-card" column-id="${columnId}">Create new card</button>`;
}

function columnButtonBuilder() {
    return `<br><button class="create-new-column">Create new column</button>`;
}

function boardDeleteButtonBuilder() {
    return `<br><button class="delete-board">Delete board</button>`;
}

function columnDeleteButtonBuilder(columnId) {
    return `<br><button class="delete-column" column-id="${columnId}">Delete column</button>`;
}

function cardDeleteButtonBuilder(cardId) {
    return `<br><button class="delete-card" card-id="${cardId}">Delete card</button>`;
}