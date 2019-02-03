import Vue from 'vue'

const refresh = new Vue()

export function publish() {
    refresh.$emit('refresh')
}

export function subscribe(fn) {
    refresh.$on('refresh', fn)
}
