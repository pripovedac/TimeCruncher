import {apiFetch} from '../auth-fetch'

const url = path => `${process.env.VUE_APP_BE_URL}${path}`

export async function getUser(id) {
    return await apiFetch('GET', url(`/users/${id}`))
}

export async function updateUser(id, data) {
    return await apiFetch('PUT', url(`/users/${id}`), data)
}

export async function deleteUser(id) {
    return await apiFetch('DELETE', url(`/users/${id}`))
}

export async function getWeeklyTasks(taskId) {
    return await apiFetch('GET', url(`/users/${taskId}/weekly`))
}

export async function getSpecificWeekTasks(taskId, dateString) {
    return await apiFetch('GET', url(`/users/${taskId}/weekly?dateString=${dateString}`))
}
//
// export async function getSingleTask(id) {
//     return await apiFetch('GET', url(`/tasks/${id}`))
// }
//
// export async function getMembers(id) {
//     return await apiFetch('GET', url(`/tasks/${id}/assignedUsers`))
// }
//
// export async function createNew(data) {
//     return await apiFetch ('POST', url(`/tasks`), data)
// }
//
// export async function deleteSingle(id) {
//     return await apiFetch('DELETE', url(`/tasks/${id}`))
// }