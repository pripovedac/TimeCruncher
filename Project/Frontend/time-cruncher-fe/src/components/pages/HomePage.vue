<template>
    <div class="home-page">
        <Sidebar :groups="groups"/>
        <router-view/>
        <!--<MainPage :tasks="tasks" groupName="Nabavka"/>-->
    </div>
</template>

<script>
    import Sidebar from '../ui/Sidebar'
    import * as global from '../../services/utilites'
    import {pusher} from '../../services/pusher'

    export default {
        name: 'HomePage',
        components: {
            Sidebar,
        },
        data() {
            return {
                groups: [],
                tasks: [],
                userId: this.getUserId()
            }
        },
        methods: {
            initGroups: async function () {
                // todo: check LS
                this.groups = await this.fetchGroups()
            },

            fetchGroups: async function () {
                console.log('Fetching groups...')
                const response = await fetch(process.env.VUE_APP_BE_URL + `/users/${this.userId}/groups`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                let groups = {}
                if (response.ok) {
                    groups = await response.json()
                    global.groupState.save(groups)
                    return groups
                }
            },

            subscribeToChannels: function () {
                console.log('this.groups: ', this.groups)
                const groupIds = this.groups.map(group => group.id)
                console.log('groupIds: ', groupIds)
                this.unsubscribeFromAll(groupIds)
                this.subscribeToAll(groupIds)
            },

            unsubscribeFromAll: function(ids) {
                ids.forEach(id =>  pusher.unsubscribe(`private-channel_for_group-${id}`))
            },

            subscribeToAll: function (ids) {
                ids.forEach(id => {
                    const channel = pusher.subscribe(`private-channel_for_group-${id}`)
                    channel.bind('task_added', function (newTask) {
                        alert('ojsa!')
                        console.log('newTask: ', newTask)
                        this.tasks.push(newTask)
                    })
                })
            },

            loadGroups: function () {
                return global.groupState.load()
            },

            getUserId: function () {
                return global.userState.load()
            }
        },

        async created() {
            await this.initGroups()
            this.subscribeToChannels()
        }
    }
</script>

<style scoped>

    .home-page {
        display: flex;
    }

    .sidebar {
        width: 15%;
        position: sticky;
        top: 0;
        left: 0;
    }

    .main-page {
        width: 100%;
    }

</style>