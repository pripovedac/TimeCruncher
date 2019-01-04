import Vue from 'vue'
import Router from 'vue-router'
import aPage from '../components/pages/a'
import bPage from '../components/pages/b'
import Register from '../components/pages/RegisterPage'
import Login from '../components/pages/LoginPage'
import Home from '../components/pages/HomePage'

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
        },
        {
            path: '/register',
            name: 'Register',
            component: Register,
            meta: {
                title: 'Register',
                isPrivate: false
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                title: 'Login',
                isPrivate: false
            }
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            meta: {
                title: 'Home',
                isPrivate: true
            }
        }
    ]
})

router.afterEach((to) => {
    const {title} = to.meta
    document.title = title != null ? title : `Time Cruncher`
})

export default router