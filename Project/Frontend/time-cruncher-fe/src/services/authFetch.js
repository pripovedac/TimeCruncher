import {userState} from './utilites'

function getCredentials() {
    console.log('loading in api')
    return userState.loadAT()
}

function apiFetchFactory({getCredentials, fetch}) {
    return async function apiFetch(method, url, body, {
        contentType = 'application/json',
        hasAuthHeader = true,
        responseType = 'json'
    } = {}) {
        const accessToken = getCredentials()

        const res = await fetch(url, {
            method,
            body: JSON.stringify(body),
            headers: {
                ...(hasAuthHeader ? {'authorization':  + accessToken} : {}),
                'content-type': contentType,
            },
        })

        if (responseType == "json" && res.status >= 200 && res.status < 300)
            return res.json()
        else {
            return {errorStatus: res.status}
        }
    }
}

export const apiFetch = apiFetchFactory({getCredentials, fetch})