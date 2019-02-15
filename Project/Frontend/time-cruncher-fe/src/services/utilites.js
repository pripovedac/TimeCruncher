export class StateFactory {
    save(name, value) {
        localStorage.setItem(name, JSON.stringify(value))
    }

    load(name) {
        return JSON.parse(localStorage.getItem(name))
    }

    remove(name) {
        localStorage.removeItem(name)
    }

    clear() {
        localStorage.clear()
    }
}

export class GroupState extends StateFactory {
    save(value) {
        super.save('groups', value)
    }

    load() {
        return super.load('groups')
    }

    loadSingle(groupId) {
        const groups = this.load()
        if (groups) {
            const res = groups.filter(({id}) => id == groupId)
            return res.length > 0 ?
                res[0] :
                null
        }
        return null
    }

    getFirst() {
        const groups = this.load()
        return groups.length > 0 ? groups[0] : null
    }

    saveLastActiveGroup(group) {
        super.save('lastGroup', group)
    }

    loadLastActiveGroup() {
        return super.load('lastGroup')
    }

    addGroup(group) {
        let groups = this.load()
        groups.push(group)
        this.save(groups)
    }

    removeGroup(groupId) {
        let groups = this.load()
        groups = groups.filter(({id}) => id != groupId)
        this.save(groups)
    }
}

export class UserState extends StateFactory {
    save(user) {
        super.save('user', user)
    }

    load() {
        return super.load('user')
    }

    saveId(id) {
        super.save('userId', id)
    }

    loadId() {
        const user = super.load('user')
        return user ? user.id : null
    }

    saveAT(token) {
        super.save('accessToken', token)
    }

    loadAT() {
        const user = super.load('user')
        return user ? user.accessToken : null
    }

    removeUser() {
        super.remove('user')
    }
}

export const storageHandler = new StateFactory()
export const groupState = new GroupState()
export const userState = new UserState()