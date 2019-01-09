<template>
    <div class="main-page">
        <TasksPage :tasks="tasks" :groupName="group.name"/>
        <TaskInfo/>
    </div>
</template>

<script>
    import TasksPage from './TasksPage'
    import TaskInfo from './TaskInfo'
    import * as global from "../../services/utilites";

    export default {
        name: 'MainPage',
        components: {
            TasksPage,
            TaskInfo,
        },
        data() {
            return {
                tasks: [],
                group: {},
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
                this.tasks = await response.json()
            },

            initGroupData: function () {
                const groupId = this.$route.params.groupId
                this.group = this.loadSingle(groupId)
            },

            loadSingle: function (groupId) {
                return global.groupState.loadSingle(groupId)
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