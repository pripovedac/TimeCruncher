<template>
    <div class="main-page">
        <TasksPage />
        <router-view />
    </div>
</template>

<script>
    import TasksPage from './TasksPage'

    export default {
        name: 'MainPage',
        components: {
            TasksPage,
        },
    }
</script>

<style scoped lang="scss">
    div {
        display: flex;
    }

    .tasks-page {
        width: 65%;
    }

    .task-info, .blank-page {
        width: 35%;
        position: sticky;
        top: 0;
        right: 0;
    }
</style>