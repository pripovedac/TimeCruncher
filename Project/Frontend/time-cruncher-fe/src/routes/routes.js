import Vue from 'vue'
import Router from 'vue-router'
import aPage from '../components/pages/a'
import bPage from '../components/pages/b'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/a',
            name: 'a page',
            component: aPage,
            meta: {
                title: 'a page'
            },
        },
        {
            path: '/b',
            name: 'b page',
            component: bPage,
            meta: {
                title: 'b page'
            },
        }
    ]
})

router.afterEach((to) => {
    const {title} = to.meta
    document.title = title != null ? title : `Time Cruncher`
})

export default router