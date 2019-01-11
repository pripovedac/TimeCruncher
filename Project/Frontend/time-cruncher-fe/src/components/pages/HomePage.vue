<template>
    <div class="home-page">
        <Sidebar :groups="groups" :user="user"/>
        <router-view/>
    </div>
</template>

<script>
    import Sidebar from '../ui/Sidebar'
    import * as global from '../../services/utilites'
    import {pusher} from '../../services/pusher'
    import * as newTask$ from '../../event-buses/newTask'

    export default {
        name: 'HomePage',
        components: {
            Sidebar,
        },
        data() {
            return {
                groups: [],
                tasks: [],
                user: {},
                groupId: this.getGroupId(),
                userId: this.getUserId()
            }
        },
        methods: {
            initGroups: async function () {
                // todo: check LS
                const groups = await this.fetchGroups()
                this.groups = groups.map(group => {
                    return {
                        ...group,
                        shouldReload: false
                    }
                })
            },

            initUser: async function () {
                console.log('Fetching user data...')
                const response = await fetch(process.env.VUE_APP_BE_URL + `/users/${this.userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.ok) {
                    this.user = await response.json()
                }
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
                const groupIds = this.groups.filter(group => !group.isPrivate).map(({id}) => id)
                console.log('subscription ids: ', groupIds)

                this.unsubscribeFromAll(groupIds)
                this.subscribeToAll(groupIds)
            },

            unsubscribeFromAll: function (ids) {
                ids.forEach(id => pusher.unsubscribe(`private-channel_for_group-${id}`))
            },

            subscribeToAll: function (ids) {
                const that = this

                ids.forEach(id => {
                    const channel = pusher.subscribe(`private-channel_for_group-${id}`)
                    channel.bind('task_added', function (newTask) {
                        alert('ojsa!')
                        if (newTask.group.id == that.groupId) {
                            newTask$.publish(newTask)
                            console.log('ja ga pablisova')
                        } else {
                            that.groups = that.modifyGroupNotifications(that.groups, newTask.group.id, true)
                        }
                    })
                })
            },

            modifyGroupNotifications: function (groups, id, value) {
                return groups.map(group => group.id == id
                    ? {...group, shouldReload: value}
                    : group)
            },

            loadGroups: function () {
                return global.groupState.load()
            },

            getUserId: function () {
                return global.userState.load()
            },

            getGroupId: function () {
                return this.$route.params.groupId
            },

            loadLastActiveGroup: function () {
                return global.groupState.getLastActiveGroup()
            },
        },

        watch: {
            $route() {
                this.groupId = this.$route.params.groupId
                this.groups = this.modifyGroupNotifications(this.groups, this.groupId, false)
                this.subscribeToChannels()
            }
        },

        async created() {
            await this.initGroups()
            await this.initUser()
            this.subscribeToChannels()
        },
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