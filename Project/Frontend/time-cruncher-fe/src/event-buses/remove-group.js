import Vue from 'vue'

const removeGroup = new Vue()

export function publish(id) {
    removeGroup.$emit('removeGroup', id)
}

export function subscribe(fn) {
    removeGroup.$on('removeGroup', fn)
}
