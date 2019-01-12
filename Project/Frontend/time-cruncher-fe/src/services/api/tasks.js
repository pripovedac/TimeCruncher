import {apiFetch} from '../authFetch'
g
export async function getTasks(id) {
    return await apiFetch('GET', process.env.VUE_APP_BE_URL + `/groups/${id}/tasks`)
}
