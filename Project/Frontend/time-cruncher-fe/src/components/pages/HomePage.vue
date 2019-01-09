<template>
    <div class="home-page">
        <Sidebar :groups="groups"/>
        <router-view/>
        <!--<MainPage :tasks="tasks" groupName="Nabavka"/>-->
    </div>
</template>

<script>
    import Sidebar from '../ui/Sidebar'
    import MainPage from './MainPage'
    import * as global from "../../services/utilites";
    import {IronMan} from '../../Hero'

    export default {
        name: 'HomePage',
        components: {
            Sidebar,
            MainPage
        },
        data() {
            return {
                groups: [],
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
        methods: {
            initGroups: async function () {
              this.groups = this.loadGroups()
              if (!this.groups) {
                  this.groups = await this.fetchGroups()
              }
            },
            fetchGroups: async function () {
                // todo: here should be fetched only groups for current member, not all of them
                console.log('fetching groups')
                const response = await fetch(process.env.VUE_APP_BE_URL + '/groups', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.ok) {
                    const groups = await response.json()
                    global.groupState.save(groups)
                }


            },
            loadGroups: function () {
                return global.groupState.load()
            },
        },

        created() {
            //IronMan.getDetails()
            this.initGroups()
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