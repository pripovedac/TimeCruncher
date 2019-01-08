<template>
    <div class="main-page">
        <TasksPage :tasks="tasks" groupName="Nabavka"/>
        <TaskInfo/>
    </div>
</template>

<script>
    import TasksPage from './TasksPage'
    import TaskInfo from './TaskInfo'

    export default {
        name: 'MainPage',
        components: {
            TasksPage,
            TaskInfo,
        },
        data() {
            return {
                tasks: [],
                groupName: 'Dare'
            }
        },
        methods: {
          initTasks: async function () {
              const groupId = this.$route.params.groupId
              const response = await fetch(process.env.VUE_APP_BE_URL + `/groups/${groupId}/tasks`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
              this.tasks = await response.json()
          }
        },
        created() {
          this.initTasks()
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