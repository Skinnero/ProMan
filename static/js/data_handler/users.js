export async function singUpUser(data){
    let res = await fetch('/api/users/sign-up',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const status = res.ok
    res = await res.json()
    localStorage.setItem('jwt', res.access_token)
    return status
}

export async function logInUser(data){
    let res = await fetch('/api/users/log-in',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const status = res.ok
    res = await res.json()
    localStorage.setItem('jwt', res.access_token)
    return status
}