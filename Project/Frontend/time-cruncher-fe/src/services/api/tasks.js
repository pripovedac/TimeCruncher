import {apiFetch} from '../authFetch'

const url = path => `${process.env.VUE_APP_BE_URL}${path}`

export async function getTasks(groupId) {
    return await apiFetch('GET', url(`/groups/${groupId}/tasks`))
}

export async function getSingleTask(id) {
    return await apiFetch('GET', url(`/tasks/${id}`))
}

export async function getMembers(id) {
    return await apiFetch('GET', url(`/tasks/${id}/users`))
}

export async function createNew(data) {
    return await apiFetch ('POST', url(`/tasks`), data)
}