import {userState} from './utilites'

function getCredentials() {
    return userState.loadAT()
}

export function apiFetchFactory({getCredentials, fetch}) {
    return async function apiFetch(method, url, {
        contentType = 'application/json',
        hasAuthHeader = true,
        responseType = 'json'
    } = {}, body) {
        const accessToken = getCredentials()
        const res = await fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: {
                ...(hasAuthHeader ? {'authorization': accessToken} : {}),
            }
        })
        if (responseType == "json" && res.status >= 200 && res.status < 300)
            return res.json()
        else
            return res.status.toString()
    }
}

export const apiFetch = apiFetchFactory({getCredentials, fetch})