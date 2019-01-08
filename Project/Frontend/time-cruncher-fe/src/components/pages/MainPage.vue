<template>
    <div class="main-page">
        <TasksPage :tasks="tasks" groupName="Nabavka"/>
        <TaskInfo />
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
        props: {
            tasks: {
                type: Array,
            },
            groupName: {
                type: String
            }
        }
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
        width: 30%;
        position: sticky;
        top: 0;
        right: 0;
    }
</style>