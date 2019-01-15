import Vue from 'vue'

const newComment = new Vue()

export function publish(comm) {
    newComment.$emit('newComment', comm)
}

export function subscribe(fn) {
    newComment.$on('newComment', fn)
}
