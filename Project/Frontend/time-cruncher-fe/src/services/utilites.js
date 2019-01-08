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
}


export const groupState = new GroupState()