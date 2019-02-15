import {apiFetch} from '../auth-fetch'
import {userState} from '../utilites'

const url = path => `${process.env.VUE_APP_BE_URL}${path}`

export async function getGroups() {
    const userId = userState.loadId()
    return await apiFetch('GET', process.env.VUE_APP_BE_URL + `/users/${userId}/groups`)
}

export async function updateSingle(id, data) {
    return await apiFetch('PUT', process.env.VUE_APP_BE_URL + `/groups/${id}`, data)
}

export async function getMembers(id) {
    return await apiFetch('GET', url(`/groups/${id}/users`))
}

export async function createNew(data) {
    return await apiFetch ('POST', url(`/groups`), data)
}

export async function deleteSingle(id) {
    return await apiFetch('DELETE', url(`/groups/${id}`))
}