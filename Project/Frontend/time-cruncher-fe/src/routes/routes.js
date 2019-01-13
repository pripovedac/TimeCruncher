import Vue from 'vue'
import Router from 'vue-router'
import aPage from '../components/pages/a'
import bPage from '../components/pages/b'
import Register from '../components/pages/RegisterPage'
import Login from '../components/pages/LoginPage'
import Home from '../components/pages/HomePage'
import NewGroup from '../components/pages/NewGroup'
import NewTask from '../components/pages/NewTask'
import MainPage from '../components/pages/MainPage'
import TaskInfoPage from '../components/pages/TaskInfoPage'
import GroupInfoPage from '../components/pages/GroupInfoPage'

import {userState} from '../services/utilites'

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
            },
            children: [
                {
                    path: 'groups/:groupId',
                    name: 'MainPage',
                    component: MainPage,
                    children: [
                        {
                            path: 'tasks/:taskId',
                            name: 'TaskInfo',
                            component: TaskInfoPage,
                            meta: {
                                title: 'Home',
                                isPrivate: true
                            },
                        },
                        {
                            path: 'details',
                            name: 'GroupInfo',
                            component: GroupInfoPage,
                            meta: {
                                title: 'Home',
                                isPrivate: true
                            },
                        }
                    ],

                 },
             ],
        },
        {
            path: '/new-group',
            name: 'NewGroup',
            component: NewGroup,
            meta: {
                title: 'New group',
                isPrivate: true
            },
        },
        {
            path: '/new-task',
            name: 'NewTask',
            component: NewTask,
            meta: {
                title: 'New task',
                isPrivate: true
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    console.log('loading in router')
    const isLoggedIn = userState.loadAT()
    const isPagePrivate = to.matched.some(record => record.meta.isPrivate)

    if (isLoggedIn && !isPagePrivate) {
        next('/home')
    } else if (!isLoggedIn && isPagePrivate) {
        next('/login')
    } else {
        next()
    }
})

router.afterEach((to) => {
    const {title} = to.meta
    document.title = title != null ? title : `Time Cruncher`
})

export default router