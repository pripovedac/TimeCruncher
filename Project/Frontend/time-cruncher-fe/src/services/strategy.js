import {apiFetch} from './auth-fetch'

export class Context {
    constructor(strategy) {
        this.concreteGetter = strategy
    }

    getTasks() {
        return this.concreteGetter.getTasks()
    }

    changePath(path, id) {
        return this.concreteGetter.changePath(path, id)
    }

    switchTask(path, id) {
        return this.concreteGetter.switchTasks(path, id)
    }
}

class Strategy {
    constructor(id) {
        this.id = id
    }

    url(path) {
        return `${process.env.VUE_APP_BE_URL}${path}`
    }

    async getTasks(url) {
        return await apiFetch('GET', url)
    }

    changePath(path, id, substring) {
        return path.replace(substring, `/tasks/${id}`)
    }

    switchTasks(path, id) {
        const index = path.indexOf('/tasks')
        const reducedPath = path.slice(0, index)
        return `${reducedPath}/tasks/${id}`
    }
}

export class Group extends Strategy {
    // group id
    constructor (id) {
        super(id)
    }

    getTasks() {
        return super.getTasks(super.url(`/groups/${this.id}/tasks`))
    }

    changePath(path, id) {
        return super.changePath(path, id, '/details')
    }
}

export class Day extends Strategy {
    // user id
    constructor (id) {
        super(id)
    }

    getTasks() {
        return super.getTasks(super.url(`/users/${this.id}/daily`))
    }

    changePath(path, id) {
        return super.changePath(path, id, '/none-selected')
    }
}

export class Uncategorized extends Strategy {
    // user id
    constructor (id) {
        super(id)
    }

    getTasks() {
        return super.getTasks(super.url(`/users/${this.id}/uncategorizedTasks`))
    }

    changePath(path, id) {
        return super.changePath(path, id, '/none-selected')
    }
}

