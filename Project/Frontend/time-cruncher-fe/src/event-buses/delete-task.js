import Vue from 'vue'

const deleteTask = new Vue()

export function publish(deletedTask) {
    deleteTask.$emit('deleteTask', deletedTask)
}

export function subscribe(fn) {
    deleteTask.$on('deleteTask', fn)
}
