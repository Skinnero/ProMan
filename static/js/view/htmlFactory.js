export const htmlTemplates = {
    board: 1,
    column: 2,
    card: 3,
    buttonBuilder: 4,
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.column]: columnBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.newBoardButton]: buttonBuilder
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
                <h3 data-board-id=${board.id}>${board.title}</h3>
                </div>
                <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
            </div>`;
}

function columnBuilder(column) {
    return `<div class="column" column-id="${column.id}">
    <h4 column-id=${column.id}>${column.title}</h4>
    </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
    <h4 data-card-id="${card.id}">${card.title}</h4
    </div>`;
}

function buttonBuilder() {
    return `<button class="create-board-button">Create Board</button>`;
  }