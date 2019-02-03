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
                    @click="mergeNewTasks($event)">
            Load new tasks
        </LoadButton>

        <LoadButton v-if="deletedTasks.length > 0"
                    @click="mergeDeletedTasks($event)">
            Some tasks are deleted
        </LoadButton>

        <LoadButton v-if="haveUpdates"
                    @click="updateTasks($event)">
            You have updates
        </LoadButton>

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
    import NoTasksCard from '../ui/NoTasksCard'
    import TaskCard from '../ui/TaskCard'
    import LoadButton from '../ui/LoadButton'
    import {PlusCircleIcon} from 'vue-feather-icons'
    import router from '../../routes/routes'

    import * as global from '../../services/utilites'
    import * as tasksApi from '../../services/api/tasks'
    import * as newTask$ from '../../event-buses/new-task'
    import * as refresh$ from '../../event-buses/refresh-tasks'
    import * as deleteTask$ from '../../event-buses/delete-task'
    import * as updateTask$ from '../../event-buses/updated-task'

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
                deletedTasks: [],
                group: {},
                userId: global.userState.loadId(),
                haveUpdates: false
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

            mergeNewTasks: function () {
                this.tasks = [...this.newTasks.reverse(), ...this.tasks]
                this.newTasks = []
            },

            mergeDeletedTasks: function () {
                const that = this

                this.tasks = this.tasks.map(task =>
                    that.deletedTasks.find(deleted => deleted.id == task.id)
                        ? null
                        : task).filter(task => task)

                if (this.deletedTasks.find(deleted => deleted.id == this.$route.params.taskId)) {
                    router.push({name: 'GroupInfo'})
                }

                this.deletedTasks = []
            },

            removeDeleted(id) {
                this.tasks = this.tasks.filter(task => task.id != id)
            },

            updateTasks() {
                this.initTasks()
                this.haveUpdates = false
                router.push({name: 'GroupInfo'})
            },

            // todo: rename to be more abstract, for any two arrays
            getDifference: function (taskMembers, groupMembers) {
                return groupMembers.map(gMember =>
                    taskMembers.find(tMember => tMember.id == gMember.id)
                        ? null
                        : gMember).filter(member => member)
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

            deleteTask$.subscribe((deletedTask) => {
                if (this.userId == deletedTask.destructorId) {
                    this.removeDeleted(deletedTask.id)
                } else {
                    this.deletedTasks.push(deletedTask)
                }
            })

            updateTask$.subscribe((task) => {
                console.log('za apdejt: ', task)
                if (task.modifierId != this.userId) {
                    this.haveUpdates = true
                }
            })

            refresh$.subscribe(() => {
                this.initTasks()
            })
        },
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    $green: #32CD32;

    .tasks-page {
        @extend %flexColumn;
        align-items: center;
        background-color: #fff;
    }

    .header {
        @include centerRowData(space-between);
        width: 70%;
    }

    .no-tasks {
        @extend %flexColumn;
        width: 70%;
        justify-content: center;
        align-items: center;
        font-size: 0.9em;
    }

    .load-button {
        width: 70%;
        margin-bottom: 1em;
    }

    button {
        @include remove(border, outline);
        @include centerRowData(center);
        background-color: #fff;
        color: black;
    }

    .icon {
        font-size: 2em;
        color: black;
    }

    .task-card {
        margin-bottom: 1em;
        width: 35vw;
    }


</style>