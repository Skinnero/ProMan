import * as usersHandler from '../data_handler/users.js'
import * as userFactory from '../view/html_builders/usersFactory.mjs'

export function setUserModal(){
    document.body.appendChild(userFactory.getUserModal())
}

export function getLogIn(){
    const labels = document.querySelectorAll(".modal-content form label")
    labels[0].innerHTML = 'Log In'
    labels[1].innerHTML = 'Password'

    const button = document.querySelectorAll('.modal-content form button')
    button[0].innerHTML = 'Log In'
}

export function getSignUp(){
    const labels = document.querySelectorAll(".modal-content form label")
    labels[2].innerHTML = 'Sign Up'
    labels[3].innerHTML = 'Password'

    const button = document.querySelectorAll('.modal-content form button')
    button[1].innerHTML = 'Sign Up'
}




















