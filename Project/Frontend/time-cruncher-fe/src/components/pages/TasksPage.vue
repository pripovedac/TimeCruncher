<template>
    <div class="tasks-page">
        <div class="header">
            <h1>
                {{group.name}}
            </h1>
            <router-link :to="{path: '/new-task'}">
                <PlusCircleIcon class="icon"/>
            </router-link>
        </div>

        <NoTasksCard v-if="tasks.length == 0"/>

        <LoadButton v-if="newTasks.length > 0"
                    @click="mergeTasks($event)">
            Load new tasks
        </LoadButton>

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
    import NoTasksCard from '../ui/NoTasksCard'
    import TaskCard from '../ui/TaskCard'
    import LoadButton from '../ui/LoadButton'
    import {PlusCircleIcon} from 'vue-feather-icons'
    import * as global from '../../services/utilites'
    import * as tasksApi from '../../services/api/tasks'
    import * as newTask$ from '../../event-buses/newTask'

    export default {
        name: 'TasksPage',
        components: {
            NoTasksCard,
            TaskCard,
            LoadButton,
            PlusCircleIcon,
        },
        data() {
            return {
                channel: {},
                tasks: [],
                newTasks: [],
                group: {},
            }
        },
        methods: {
            initTasks: async function () {
                console.log('Fetching tasks...')
                const groupId = this.$route.params.groupId
                const response = await tasksApi.getTasks(groupId)

                if (!response.errorStatus) {
                    this.tasks = response.reverse()
                } else {
                    alert('Problem with tasks loading.')
                }

            },

            mergeTasks: function () {
                this.tasks = [...this.newTasks.reverse(), ...this.tasks]
                this.newTasks = []
            },

            saveGroup: function () {
                const groupId = this.$route.params.groupId
                const group =  global.groupState.loadSingle(groupId)
                global.groupState.saveLastActiveGroup(group)
            },

            loadGroup: function () {
                return global.groupState.loadLastActiveGroup()
            }
        },

        watch: {
            $route() {
                this.initTasks()
                this.saveGroup()
                this.group = this.loadGroup()
            }
        },
        created() {
            this.initTasks()
            this.saveGroup()
            this.group = this.loadGroup()

            newTask$.subscribe((newTask) => {
                this.newTasks.push(newTask)
            })
        },
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

    .no-tasks {
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 0.9em;
    }

    .load-button {
        width: 70%;
        margin-bottom: 1em;
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