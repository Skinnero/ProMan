export function getUserModal(){
    const modal = document.createElement('div')
    const userModal = document.createElement('div')
    userModal.className = 'modal-content'
    userModal.appendChild(getUserForm())
    modal.className = 'modal'
    modal.style.display = 'none'
    modal.appendChild(userModal)
    return modal
}

function getUserForm(){
    const userForm = document.createElement('form')
    userForm.appendChild(document.createElement('label'))
    userForm.appendChild(getUserNameInput())
    userForm.appendChild(document.createElement('label'))
    userForm.appendChild(getPasswordInput())
    userForm.appendChild(getSubmitButton())
    return userForm
}

function getUserNameInput(){
    const userNameInput = document.createElement('input')
    userNameInput.type = 'text'
    userNameInput.name = 'login'
    return userNameInput
}

function getPasswordInput(){
    const passwordInput = document.createElement('input')
    passwordInput.type = 'password'
    passwordInput.name = 'password'
    return passwordInput
}

function getSubmitButton(){
    const submitButton = document.createElement('button')
    submitButton.type = 'submit'
    return submitButton
}
