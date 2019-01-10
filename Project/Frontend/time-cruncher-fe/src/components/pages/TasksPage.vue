<template>
    <div class="tasks-page">
        <div class="header">
            <h1>
                {{groupName}}
            </h1>
            <router-link :to="{path: '/new-task'}">
                <PlusCircleIcon class="icon"/>
            </router-link>
        </div>
        <TaskCard v-for="task in tasks"
                  :key="task.id"
                  :id="task.id"
                  :name="task.name"
                  :description="task.description"
                  :date="task.dueTime"
                  :done="task.isCompleted"
        />
    </div>
</template>

<script>
    import TaskCard from '../ui/TaskCard'
    import {PlusCircleIcon} from 'vue-feather-icons'

    export default {
        name: "TasksPage",
        components: {
            TaskCard,
            PlusCircleIcon,
        },
        props: {
            groupName: {
                type: String
            },
            tasks: {
                type: Array
            }
        }
    }
</script>

<style scoped lang="scss">
    $green: #32CD32;

    .tasks-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        /*border-right: 1px solid black;*/
        background-color: #fff;
        height: 100%;
    }

    .header {
        width: 70%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        /*margin-bottom: 1em;*/
        /*border: 1px solid black;*/
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        outline: none;
        background-color: #fff;
        color: black;
        /*border: 1px solid black;*/
    }

    .icon {
        font-size: 2em;
        color: black;

    }

    h1 {
        /*border: 1px solid black;*/
    }

    .task-card {
        margin-bottom: 1em;
        width: 70%;
        /*height: 20vh;*/
    }


</style>