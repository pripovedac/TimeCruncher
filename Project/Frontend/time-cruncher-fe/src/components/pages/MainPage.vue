<template>
    <div class="main-page">
        <TasksPage />
        <router-view />
    </div>
</template>

<script>
    import TasksPage from './TasksPage'
    import Info from './TaskInfoPage'
    import * as global from "../../services/utilites";

    export default {
        name: 'MainPage',
        components: {
            TasksPage,
        },

        data() {
            return {
                tasks: [],
                group: {},
                info: {},
            }
        },

        methods: {
            init: function () {
                this.initTasks()
                this.initGroupData()
            },

            initTasks: async function () {
                const groupId = this.$route.params.groupId
                const response = await fetch(process.env.VUE_APP_BE_URL + `/groups/${groupId}/tasks`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const tasks = await response.json()
                this.tasks = tasks.reverse()
            },

            initGroupData: function () {
                const groupId = this.$route.params.groupId
                this.group = this.loadSingle(groupId)
                this.info = {
                    ...this.group,
                    type: 'group'
                }
                this.saveLastActiveGroup(this.group)
            },

            loadSingle: function (groupId) {
                return global.groupState.loadSingle(groupId)
            },
            
            saveLastActiveGroup: function (group) {
                global.groupState.setLastActiveGroup(group)
            }
        },

        watch: {
          $route() {
              this.init()
          }
        },

        created() {
            this.init()
        },
    }
</script>

<style scoped lang="scss">
    div {
        display: flex;
    }

    .tasks-page {
        width: 70%;
    }

    .task-info {
        min-width: 30%;
        position: sticky;
        top: 0;
        right: 0;
    }
</style>