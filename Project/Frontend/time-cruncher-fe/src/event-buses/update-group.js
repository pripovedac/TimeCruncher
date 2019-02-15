import Vue from 'vue'

const updateGroup = new Vue()

export function publish(id) {
    updateGroup.$emit('updateGroup', id)
}

export function subscribe(fn) {
    updateGroup.$on('updateGroup', fn)
}
