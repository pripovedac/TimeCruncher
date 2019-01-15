import {apiFetch} from '../auth-fetch'

const url = path => `${process.env.VUE_APP_BE_URL}${path}`

export async function getComments(taskId) {
    return await apiFetch('GET', url(`/tasks/${taskId}/comments`))
}

export async function createNew(data) {
    return await apiFetch ('POST', url(`/comments`), data)
}