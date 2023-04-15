export async function singUpUser(data){
    return await fetch('/api/users/sign-up',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

export async function logInUser(data){
    return await fetch('/api/users/log-in',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}