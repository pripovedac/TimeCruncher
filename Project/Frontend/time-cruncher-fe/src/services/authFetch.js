// const isReachable = require('is-reachable')
// export const destinationUrl = 'http://10.14.79.30:3030'
//
// export function getCredentials() {
//     return {
//         accessToken: localStorage.getItem('accessToken'),
//     }
// }
//
// export function deleteCredentials() {
//     localStorage.removeItem('accessToken')
// }
//
// export function setCredentials(accessToken) {
//     localStorage.setItem('accessToken', accessToken)
// }
//
// async function getRefreshToken(refreshToken) {
//     return fetch('http://10.66.165.9:3030/', {
//         method: 'POST',
//         headers: {
//             'authorization': 'refresh ' + refreshToken,
//             'content-type': 'application/json'
//         },
//         body: JSON.stringify({
//             grantType: "refresh_token",
//             refreshToken
//         })
//     })
// }
//
// export function apiFetchFactory({getCredentials, deleteCredentials, setCredentials, fetch}) {
//     return async function apiFetch(method, url, {
//         contentType = 'application/json',
//         hasAuthHeader = true,
//         responseType = 'json'
//     } = {}, body) {
//         // isReachable('192.168.137.105:8080').then(r => console.log("reachable ", r))
//         const {accessToken} = getCredentials()
//         const res = await fetch(url, {
//             method: method,
//             body: JSON.stringify(body),
//             headers: {
//                 ...(hasAuthHeader ? {'authorization': accessToken} : {}),
//             }
//         })
//         if (responseType == "json" && res.status >= 200 && res.status < 300)
//             return res.json()
//         else
//             return res.status.toString()
//
//         // if (res.status == 401) {
//         //     const refreshResponse = await getRefreshToken(refreshToken)
//         //
//         //     if (refreshResponse.status == 401) {
//         //         // redirect to logout
//         //         deleteCredentials()
//         //     } else {
//         //         const {accessToken, refreshToken} = await refreshResponse.json()
//         //         setCredentials(accessToken, refreshToken)
//         //         const res2 = await fetch(url, {
//         //             method,
//         //             headers: {
//         //                 ...(hasAuthHeader ? {'authorization': 'Bearer ' + accessToken} : {}),
//         //                 'content-type': contentType
//         //             }
//         //         })
//         //         if (responseType == 'json') {
//         //             return res2.json()
//         //         }
//         //     }
//         // } else {
//         //     if (responseType == 'json') {
//         //console.log(res.json())
//         // }
//         // todo handle other response types
//
//     }
//
// }
//
// // export const apiFetch = apiFetchFactory({getCredentials, setCredentials, deleteCredentials, fetch})