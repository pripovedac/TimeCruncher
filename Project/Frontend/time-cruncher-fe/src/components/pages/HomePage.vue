<template>
    <div class="home-page">
        <Sidebar :groups="groups"/>
        <MainPage :tasks="tasks" groupName="Nabavka"/>
    </div>
</template>

<script>
    import Sidebar from '../ui/Sidebar'
    import MainPage from './MainPage'
    import {IronMan} from '../../Hero'

    export default {
        name: 'HomePage',
        components: {
            Sidebar,
            MainPage
        },
        data() {
            return {
                groups: [
                    {
                        id: 1,
                        name: 'nabavka',
                        isPrivate: false
                    },
                    {
                        id: 2,
                        name: 'neopix',
                        isPrivate: true
                    },
                    {
                        id: 3,
                        name: 'faks',
                        isPrivate: false
                    },
                    {
                        id: 4,
                        name: 'selo',
                        isPrivate: true
                    },
                    {
                        id: 5,
                        name: 'teretana',
                        isPrivate: true
                    }
                ],
                tasks: [
                    {
                        id: 1,
                        name: 'Idea',
                        description: 'Mleko, sir, jogurtMleko, sir, jogurtMleko, sir, jogurtMleko, sir, jogurtMleko, sir, jogurt',
                        date: '14. 04. 1996.',
                        done: true
                    },
                    {
                        id: 2,
                        name: 'Pijaca',
                        description: 'Paradajz',
                        done: true,
                    },
                    {
                        id: 3,
                        name: 'Merkator',
                        description: 'Mleko',
                        date: '15. 04. 1996.'
                    },
                    {
                        id: 4,
                        name: 'Idea',
                        description: 'Mleko, sir, jogurt',
                        date: '14. 04. 1996.',
                        done: true
                    },
                    {
                        id: 5,
                        name: 'Idea',
                        description: 'Mleko, sir, jogurt',
                        date: '14. 04. 1996.'
                    },
                    {
                        id: 13,
                        name: 'Merkator',
                        description: 'Mleko',
                        date: '15. 04. 1996.'
                    },
                    {
                        id: 41,
                        name: 'Idea',
                        description: 'Mleko, sir, jogurt',
                        date: '14. 04. 1996.',
                        done: true
                    },
                    {
                        id: 51,
                        name: 'Idea',
                        description: 'Mleko, sir, jogurt',
                        date: '14. 04. 1996.'
                    },
                ]
            }
        },
        created() {
            IronMan.getDetails()
        }
    }
</script>

<style scoped>

    .home-page {
        display: flex;
    }

    .sidebar {
        width: 15%;
        position: relative;
        top: 0;
        left: 0;
    }

    .main-page {
        width: 100%;
    }

</style>