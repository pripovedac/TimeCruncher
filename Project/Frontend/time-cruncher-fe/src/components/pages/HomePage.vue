<template>
    <div class="home-page">
        <div class="sidebar-container">
            <Sidebar :groups="groups"
                     :user="user"
                     :newGroup="newGroups.length > 0"
                     @mergeGroups="mergeGroups($event)"
                     @logout="logout($event)"
            />
        </div>
        <router-view/>
    </div>
</template>

<script>
    import Sidebar from '../ui/Sidebar'
    import router from '../../routes/routes'
    import * as global from '../../services/utilites'
    import {SingletonPusher} from '../../services/pusher'
    import * as groupsApi from '../../services/api/groups'
    import * as newTask$ from '../../event-buses/new-task'
    import * as deleteTask$ from '../../event-buses/delete-task'
    import * as updateTask$ from '../../event-buses/updated-task'
    import * as newComment$ from '../../event-buses/new-comment'
    import * as removeGroup$ from '../../event-buses/remove-group'
    import * as updateGroup$ from '../../event-buses/update-group'

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
                groupId: this.getRouteGroupId(),
                userId: this.getUserId(),
                pusher: {},
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
                this.pusher = SingletonPusher.Instance()
                this.pusher.config.auth.headers = {'access_token': this.loadAT()}
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
                const that = this
                ids.forEach(id => that.pusher.unsubscribe(`private-channel_for_group-${id}`))
            },

            subscribeToAll: function (ids) {
                const that = this

                ids.forEach(id => {
                    const channel = that.pusher.subscribe(`private-channel_for_group-${id}`)
                    channel.bind('task_added', function (newTask) {
                        if (newTask.group.id == that.groupId) {
                            newTask$.publish(newTask)
                        } else {
                            that.groups = that.modifyGroupNotifications(that.groups, newTask.group.id, true)
                        }
                    })

                    channel.bind('task_removed', function (deletedTask) {
                        console.log('deleted task: ', deletedTask)
                        if (deletedTask.groupId == that.groupId) {
                            deleteTask$.publish(deletedTask)
                        }
                    })

                    channel.bind('task_edited', function (updatedTask) {
                        if(updatedTask.group.id == that.groupId) {
                            updateTask$.publish(updatedTask)
                        }
                    })

                    channel.bind('group_removed', function (group) {
                        that.removeGroup(group.id)
                        that.filterGroups(group.id)
                        that.saveLastActiveGroup(that.getFirstGroup())
                        if (that.getRouteGroupId() == group.id) {
                            router.push({name: 'GroupInfo', params: {groupId: that.loadLastActiveGroup().id}})
                        }
                    })

                    channel.bind('group_edited', function (group) {
                        that.updateGroups(group)
                        updateGroup$.publish(group)
                    })

                    if (id == that.groupId) {
                        channel.bind('comment_added', function (newComment) {
                            newComment$.publish(newComment)
                        })
                    }
                })
            },

            unsubscribeFromGroupUpdates: function () {
                this.pusher.unsubscribe(`private-channel_for_user-${this.userId}`)
            },

            subscribeToGroupUpdates: function () {
                const that = this
                const channel = this.pusher.subscribe(`private-channel_for_user-${this.userId}`)
                channel.bind('added_to_group', function (newGroup) {
                    that.newGroups.push(newGroup)
                    that.saveNewGroup(newGroup)
                })
            },

            modifyGroupNotifications: function (groups, id, value) {
                return groups.map(group => group.id == id
                    ? {...group, shouldReload: value}
                    : group)
            },

            filterGroups: function (groupId) {
                this.groups = this.groups.filter(({id}) => id != groupId)
            },

            updateGroups: function (group) {
                this.groups = this.groups.map(existingGroup => existingGroup.id == group.id ? group : existingGroup)
                this.saveGroups(this.groups)
            },

            mergeGroups: function () {
                this.groups = [...this.groups, ...this.newGroups]
                this.newGroups = []
            },

            logout: function () {
                this.clearStorage()
                router.push({path: '/login'})
            },

            getRouteGroupId: function () {
                return this.$route.params.groupId
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

            saveLastActiveGroup: function (group) {
                global.groupState.saveLastActiveGroup(group)
            },

            saveNewGroup: function (group) {
                global.groupState.addGroup(group)
            },

            saveGroups: function (groups) {
                global.groupState.save(groups)
            },

            removeGroup: function (id) {
                global.groupState.removeGroup(id)
            },

            clearStorage: function () {
                global.storageHandler.clear()
            },

            getFirstGroup: function () {
                return global.groupState.getFirst()
            }
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

    .sidebar, .sidebar-container {
        width: 15vw;
        position: sticky;
        top: 0;
        left: 0;
    }

    .main-page {
        width: 100%;
    }
</style>