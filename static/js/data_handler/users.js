export async function singUpUser(data){
    const res = await fetch('/api/users/sign-up',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res.ok
}

export async function logInUser(data){
    const res = await fetch('/api/users/log-in',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res.ok
}

export async function logOutUser(){
    const res = await fetch('/api/users/log-out',{method: "GET"})
    return res.ok
}