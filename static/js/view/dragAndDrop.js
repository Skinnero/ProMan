const draggingClass = 'dragging'
let dragSource

export function initDragAndDrop(){
    const columns = document.querySelectorAll('.columns')
    const card = document.querySelectorAll('.cards')
    columns.forEach(column => { 
        column.addEventListener('dragstart', handleDragStart, false)
        column.addEventListener('dragenter', handleDragEnter, false)
        column.addEventListener('dragover', handleDragOver, false)
        column.addEventListener('dragleave', handleDragLeave, false)
        column.addEventListener('drop', handleDrop, false)
        column.addEventListener('dragend', handleDragEnd, false)
    })
    card.forEach(card => { 
        card.addEventListener('dragstart', handleDragStart, false)
        card.addEventListener('dragenter', handleDragEnter, false)
        card.addEventListener('dragover', handleDragOver, false)
        card.addEventListener('dragleave', handleDragLeave, false)
        card.addEventListener('drop', handleDrop, false)
        card.addEventListener('dragend', handleDragEnd, false)
    })
}
function handleDragStart(e){
    dragSource = this
    e.dataTransfer.setData('text/html', this.innerHTML)
}

function handleDragEnter(e){
}

function handleDragOver(e){
}

function handleDragLeave(e){

}
function handleDrop(e){
    e.stopPropagation()

    if (dragSource != this){
        dragSource.innerHTML = this.innerHTML
        this.innerHTML = e.dataTransfer.getData('text/html')
    }
    
    e.preventDefault()
}

function handleDragEnd(){
}