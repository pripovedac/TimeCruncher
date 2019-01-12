import {apiFetch} from '../authFetch'
import {userState} from '../utilites'

export async function getGroups() {
    const userId = userState.loadId()
    return await apiFetch('GET', process.env.VUE_APP_BE_URL + `/users/${userId}/groups`)
}