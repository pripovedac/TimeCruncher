<template>
    <div class="home-page">
        <Sidebar :groups="groups"
                 :user="user"
                 :newGroup="newGroups.length > 0"
                 @mergeGroups="mergeGroups($event)"
                 @logout="logout($event)"
        />
        <router-view/>
    </div>
</template>

<script>
    import Sidebar from '../ui/Sidebar'
    import router from '../../routes/routes'
    import * as global from '../../services/utilites'
    import {pusher} from '../../services/pusher'
    import * as groupsApi from '../../services/api/groups'
    import * as newTask$ from '../../event-buses/new-task'
    import * as newComment$ from '../../event-buses/new-comment'
    import * as removeGroup$ from '../../event-buses/remove-group'


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

            initPusher: function () {
                pusher.config.auth.headers = {'access_token': this.loadAT()}
            },

            fetchGroups: async function () {
                const response = await groupsApi.getGroups()

                // todo: do not fetch everytime, use LS
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

                    if (id == that.groupId) {
                        channel.bind('comment_added', function (newComment) {
                            console.log('new comment')
                            newComment$.publish(newComment)
                        })
                    }
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

            logout: function () {
                this.clearStorage()
                router.push({path: '/login'})
            },

            loadGroups: function () {
                return global.groupState.load()
            },

            getUserId: function () {
                return global.userState.loadId()
            },

            loadAT: function () {
                return global.userState.loadAT()
            },

            loadLastActiveGroup: function () {
                return global.groupState.loadLastActiveGroup()
            },

            clearStorage: function () {
                global.userState.removeUser()
            },

            getGroupId: function () {
                return this.$route.params.groupId
            },
        },

        watch: {
            $route() {
                this.groupId = this.$route.params.groupId
                this.groups = this.modifyGroupNotifications(this.groups, this.groupId, false)
                this.initPusher()
                this.subscribeToChannels()
            }
        },

        async created() {
            this.initPusher()
            await this.initGroups()
            await this.initUser()
            this.subscribeToChannels()

            removeGroup$.subscribe((groupId) => {
                this.groups = this.groups.filter(({id}) => id != groupId)
            })
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