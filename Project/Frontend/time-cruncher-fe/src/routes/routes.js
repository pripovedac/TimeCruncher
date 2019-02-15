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
import WeeklySchedule from '../components/pages/WeeklySchedule'
import PlaceholderInfoPage from '../components/pages/PlaceholderInfoPage'
import WelcomePage from '../components/pages/WelcomePage'
import ModifyUserPage from '../components/pages/ModifyUserPage'

import * as global from '../services/utilites'

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
                title: 'b page',
                isPrivate: true,
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
                  path: 'welcome',
                  name: 'WelcomePage',
                  component: WelcomePage,
                  title: 'Welcome'
                },
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
                                title: 'Groups',
                                isPrivate: true
                            },
                        },
                        {
                            path: 'details',
                            name: 'GroupInfo',
                            component: GroupInfoPage,
                            meta: {
                                title: 'Groups',
                                isPrivate: true
                            },
                        },

                    ],
                },
                {
                    path: 'daily',
                    name: 'MainPage',
                    component: MainPage,
                    title: 'Daily',
                    children: [
                        {
                            path: 'tasks/:taskId',
                            name: 'TaskInfo',
                            component: TaskInfoPage,
                            meta: {
                                title: 'Daily',
                                isPrivate: true
                            },
                        },
                        {
                            path: 'none-selected',
                            name: 'DailyInfo',
                            component: PlaceholderInfoPage,
                            meta: {
                                title: 'Daily',
                                isPrivate: true
                            },
                        },
                    ],
                },
                {
                    path: 'uncategorized',
                    name: 'Uncategorized',
                    component: MainPage,
                    title: 'Uncategorized',
                    children: [
                        {
                            path: 'tasks/:taskId',
                            name: 'TaskInfo',
                            component: TaskInfoPage,
                            meta: {
                                title: 'Uncategorized',
                                isPrivate: true
                            },
                        },
                        {
                            path: 'none-selected',
                            name: 'UncategorizedInfo',
                            component: PlaceholderInfoPage,
                            meta: {
                                title: 'Uncategorized',
                                isPrivate: true
                            },
                        },
                    ],
                },
                {
                    path: 'weekly',
                    name: 'Weekly',
                    component: WeeklySchedule,
                    meta: {
                        title: 'Weekly',
                        isPrivate: true
                    },
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
        {
            path: '/modify-user',
            name: 'ModifyUser',
            component: ModifyUserPage,
            meta: {
                title: 'Modify user',
                isPrivate: true
            }
        },

    ]
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = global.userState.loadAT()
    const group = global.groupState.loadLastActiveGroup()
    const isPagePrivate = to.matched.some(record => record.meta.isPrivate)
    if (isLoggedIn && !isPagePrivate) {
        next('/home/daily/none-selected')
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