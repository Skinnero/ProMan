import * as domManager from "./view/domManager.js";

function init(){
    domManager.setUsersDom()
    domManager.setBoardsButtons()
}

init()

async function test(){
    const token = localStorage.getItem('jwt')
    let res = await fetch("/private",
        {
        method: 'GET',
        headers: {
        'Authorization': 'Bearer ' + token
        }}
    )
    res = await res.json()
    console.log(res)
}

await test()

