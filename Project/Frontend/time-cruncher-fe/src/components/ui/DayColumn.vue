<template>
    <div class="day-column">
        <router-link :to="{path: '/login'}">{{name}}</router-link>
        <TaskCard v-for="task in tasks"
                  :key="task.id"
                  :id="task.id"
                  :name="task.name"
                  :description="task.description"
                  :date="task.dueTime"
                  :isCompleted="task.isCompleted"
        />
    </div>
</template>

<script>
    import TaskCard from './TaskCard'

    export default {
        name: 'DayColumn',

        components: {
            TaskCard,
        },

        props: {
            name: {
                type: String,
            },
            tasks: {
                type: Array,
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .day-column {
        @extend %flexColumn;
        width: 20vw;
        height: 100%;
        padding-left: 0.5em;
        padding-right: 0.5em;
        font-family: inherit;
        overflow-y: auto;

        a {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            color: black;
            text-decoration: none;
            text-align: center;
            text-transform: uppercase;
            font-weight: bold;
        }

        a:hover {
            color: $darkblue;
        }
    }

    .task-card {
        margin-bottom: 1em;
        pointer-events: none;
    }
</style>