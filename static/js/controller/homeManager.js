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
    let login = document.querySelector('.login').value
    let password = document.querySelector('.password').value
    let response  = await fetch("/api/users/log-in", {
      method:'POST', 
      headers:{
          'Content-Type':'application/json'
      },
      body:JSON.stringify(loginTemplate(login, password))
    })
    if(response.ok) {
        window.location="/"
    } else {
        alert('Wrong login or password')
    }
}

function signupButton() {
    const registerModal = htmlFactory(htmlTemplates.registerModal);
    const content = registerModal();
    domManager.addChild("#root", content);
    domManager.addEventListener(
        `.cancel`,
        "click",
        cancelRegister
    );
    domManager.addEventListener(
        `.confirm-register`,
        "click",
        register
    );

    async function register() {
        let login = document.querySelector('.login-register').value
        let password = document.querySelector('.password-register').value
        let confirmPassword = document.querySelector('.confirm-password-register').value
        if (password != confirmPassword) {
            alert('Passwords are not the same')
        } else {
            let response  = await fetch("/api/users/sign-up", {
                method:'POST', 
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(registerTemplate(login, password))
              })
            if (response.ok) {
                alert('You registered sucesfully')
                window.location="/"
            } else {
                alert('Login is busy')
            }

        }
    }


    function cancelRegister () {
        document.querySelector(".modal").remove()
    }
}