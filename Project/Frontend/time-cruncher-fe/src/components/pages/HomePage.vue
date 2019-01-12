<template>
    <div class="home-page">
        <Sidebar :groups="groups"
                 :user="user"
                 :newGroup="newGroups.length > 0"
                 @mergeGroups="mergeGroups($event)"
        />
        <router-view/>
    </div>
</template>

<script>
    import Sidebar from '../ui/Sidebar'
    import * as global from '../../services/utilites'
    import {pusher} from '../../services/pusher'
    import * as groupsApi from '../../services/api/groups'
    import * as newTask$ from '../../event-buses/newTask'


    export default {
        name: 'HomePage',
        components: {
            Sidebar,
        },
        data() {
            return {
                groups: [],
                newGroups: [],
                tasks: [],
                user: {},
                groupId: this.getGroupId(),
                userId: this.getUserId()
            }
        },
        methods: {
            initGroups: async function () {
                const groups = await this.fetchGroups()
                this.groups = groups.map(group => {
                    return {
                        ...group,
                        shouldReload: false
                    }
                })
            },

            initUser: async function () {
                this.user = global.userState.load()
            },

            fetchGroups: async function () {
                const response = await groupsApi.getGroups()

                if (!response.errorStatus) {
                    const groups = response
                    global.groupState.save(groups)
                    return groups
                } else {
                    // todo: handle errors
                    alert('Problem with groups loading.')
                }
            },

            subscribeToChannels: function () {
                const groupIds = this.groups.filter(group => !group.isPrivate).map(({id}) => id)
                console.log('Subscription ids: ', groupIds)

                this.unsubscribeFromAll(groupIds)
                this.subscribeToAll(groupIds)
                this.unsubscribeFromGroupUpdates()
                this.subscribeToGroupUpdates()
            },

            unsubscribeFromAll: function (ids) {
                ids.forEach(id => pusher.unsubscribe(`private-channel_for_group-${id}`))
            },

            subscribeToAll: function (ids) {
                const that = this

                ids.forEach(id => {
                    const channel = pusher.subscribe(`private-channel_for_group-${id}`)
                    channel.bind('task_added', function (newTask) {
                        if (newTask.group.id == that.groupId) {
                            newTask$.publish(newTask)
                        } else {
                            that.groups = that.modifyGroupNotifications(that.groups, newTask.group.id, true)
                        }
                    })
                })
            },

            unsubscribeFromGroupUpdates: function () {
                pusher.unsubscribe(`private-channel_for_user-${this.userId}`)
            },

            subscribeToGroupUpdates: function () {
                const that = this
                const channel = pusher.subscribe(`private-channel_for_user-${this.userId}`)
                channel.bind('added_to_group', function (newGroup) {
                    alert('New group!')
                    that.newGroups.push(newGroup)
                })
            },

            modifyGroupNotifications: function (groups, id, value) {
                return groups.map(group => group.id == id
                    ? {...group, shouldReload: value}
                    : group)
            },

            mergeGroups: function () {
              this.groups = [...this.groups, ...this.newGroups]
              this.newGroups = []
            },

            loadGroups: function () {
                return global.groupState.load()
            },

            getUserId: function () {
                return global.userState.loadId()
            },

            getGroupId: function () {
                return this.$route.params.groupId
            },

            loadLastActiveGroup: function () {
                return global.groupState.loadLastActiveGroup()
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