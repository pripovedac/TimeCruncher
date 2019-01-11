import Vue from 'vue'

const newTask = new Vue()

export function publish(task) {
    newTask.$emit('newTask', task)
}

export function subscribe(fn) {
    newTask.$on('newTask', fn)
}
