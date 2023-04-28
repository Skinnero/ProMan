import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import { createBoard } from "./boardsManager.js";
import { apiPost, dataHandler } from "../data/dataHandler.js";
import { loginTemplate, registerTemplate } from "../data/dataTemplates.js";

export function menuListeners () {
    const login = document.querySelector('.login-button')

    domManager.addEventListener(
      `li[data-id='createBoard']`,
      "click",
      createBoard
    )

    if (login) {
        domManager.addEventListener(
          `.login-button`,
          "click",
          loginButton
        )
        domManager.addEventListener(
          `.register-button`,
          "click",
          signupButton
        )
    } else {
		domManager.addEventListener(
			`.logout-button`,
			"click",
			dataHandler.logoutUser
		  )
	}
}

async function loginButton() {
	// TODO: wrong data alert
    let login = document.querySelector('.login').value
    let password = document.querySelector('.password').value
    await apiPost("/api/users/log-in", loginTemplate(login, password))
    location.reload()
}

async function signupButton() {
	// TODO: user exists alert
    let login = document.querySelector('.login').value
    let password = document.querySelector('.password').value
    await apiPost("/api/users/sign-up", registerTemplate(login, password))
    location.reload()
}