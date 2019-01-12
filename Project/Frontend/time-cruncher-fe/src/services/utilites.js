export class StateFactory {
    save(name, value) {
        localStorage.setItem(name, JSON.stringify(value))
    }

    load(name) {
        return JSON.parse(localStorage.getItem(name))
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
        const res = groups.filter(({id}) => id == groupId)
        return res.length > 0 ?
            res[0] :
            null
    }

    saveLastActiveGroup(group) {
        super.save('lastGroup', group)
    }

    loadLastActiveGroup() {
        return super.load('lastGroup')
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
}


export const groupState = new GroupState()
export const userState = new UserState()