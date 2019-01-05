<template>
    <div>
        <Sidebar :groups="groups"/>
        <router-view />
    </div>
</template>

<script>
    import Sidebar from '../ui/Sidebar'

    export default {
        name: "MainPage",
        components: {
            Sidebar
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
                        description: 'Mleko, sir, jogurt',
                        date: '14. 04. 1996.'
                    },
                    {
                        id: 2,
                        name: 'Pijaca',
                        description: 'Paradajz',
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
                        date: '14. 04. 1996.'
                    },
                    {
                        id: 5,
                        name: 'Idea',
                        description: 'Mleko, sir, jogurt',
                        date: '14. 04. 1996.'
                    },
                ]
            }
        }
    }
</script>

<style scoped>

    .sidebar {
        width: 15%;
        position: relative;
        top: 0;
        left: 0;
    }

    .tasks-page {
        width: 55%;
    }

</style>