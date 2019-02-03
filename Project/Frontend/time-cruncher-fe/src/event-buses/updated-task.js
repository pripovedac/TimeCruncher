import Vue from 'vue'

const removeGroup = new Vue()

export function publish(task) {
    removeGroup.$emit('updatedTask', task)
}

export function subscribe(fn) {
    removeGroup.$on('updatedTask', fn)
}
