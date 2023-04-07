export async function singUpUser(data){
    const res = await fetch('/api/users/sign-up',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res
}

export async function logInUser(data){
    const res = await fetch('/api/users/log-in',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return res
}