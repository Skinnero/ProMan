export function getColmunDiv(column) {
    let columnDiv = document.createElement('div')
    columnDiv.className = 'columns'
    columnDiv.draggable = true
    columnDiv.dataset.id = column.id
    return columnDiv
}
export function getColumnTitle(column) {
    const columnTitle = document.createElement('div')
    const columnTextarea = document.createElement('textarea')
    const deleteColumnSpan = document.createElement('span')
    columnTitle.className = 'column-title'
    columnTextarea.dataset.id = column.id
    columnTextarea.value = column.name
    deleteColumnSpan.className = 'delete-column'
    deleteColumnSpan.innerText = 'x'
    deleteColumnSpan.dataset.id = column.id
    columnTitle.appendChild(columnTextarea)
    columnTitle.appendChild(deleteColumnSpan)
    return columnTitle
}

export function getAddColumnButton() {
    const buttonDiv = document.createElement('div')
    const addColumnButton = document.createElement('button')
    addColumnButton.className = 'create-column'
    addColumnButton.innerText = 'Add Column'
    buttonDiv.className = 'button-column'
    buttonDiv.appendChild(addColumnButton)
    return buttonDiv
}