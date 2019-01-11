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

    setLastActiveGroup(group) {
        return localStorage.setItem('lastGroup', JSON.stringify(group))
    }

    getLastActiveGroup() {
        return super.load('lastGroup')
    }
}

export class UserState extends StateFactory {
    save(value) {
        super.save('userId', value)
    }

    load() {
        return super.load('userId')
    }

    loadAT() {
        return super.load('accessToken')
    }
}


export const groupState = new GroupState()
export const userState = new UserState()