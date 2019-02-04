import {apiFetch} from '../auth-fetch'

const url = path => `${process.env.VUE_APP_BE_URL}${path}`

// redundant
export async function getGroupTasks(groupId) {
    return await apiFetch('GET', url(`/groups/${groupId}/tasks`))
}

export async function getDailyTasks(userId) {
    return await apiFetch('GET', url(`/users/${userId}/daily`))
}

export async function getUcategorizedTasks(userId) {
    return await apiFetch('GET', url(`/users/${userId}/uncategorizedTasks`))
}
// until here

export async function getSingleTask(id) {
    return await apiFetch('GET', url(`/tasks/${id}`))
}

export async function getMembers(id) {
    return await apiFetch('GET', url(`/tasks/${id}/assignedUsers`))
}

export async function createNew(data) {
    return await apiFetch ('POST', url(`/tasks`), data)
}

export async function deleteSingle(id) {
    return await apiFetch('DELETE', url(`/tasks/${id}`))
}

export async function updateSingle(id, data) {
    return await apiFetch('PUT', url(`/tasks/${id}`), data)
}