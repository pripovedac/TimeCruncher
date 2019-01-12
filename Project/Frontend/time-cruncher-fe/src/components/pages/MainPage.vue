<template>
    <div class="main-page">
        <TasksPage />
        <router-view />
    </div>
</template>

<script>
    import TasksPage from './TasksPage'
    import * as global from '../../services/utilites'
    import * as tasksApi from '../../services/api/tasks'

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