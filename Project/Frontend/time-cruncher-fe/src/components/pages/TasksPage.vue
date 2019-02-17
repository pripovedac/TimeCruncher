<template>
    <div class="tasks-page">

        <div class="header">
            <h1 v-if="mode == 'Groups'">
                {{group.name}}
            </h1>
            <h1 v-else-if="mode == 'Daily'">
                Daily tasks
            </h1>
            <h1 v-else-if="mode == 'Uncategorized'">
                Uncategorized tasks
            </h1>
            <router-link :to="{path: '/new-task'}" v-if="mode == 'Groups'">
                <PlusCircleIcon class="icon"/>
            </router-link>
        </div>

        <LoadingState v-if="isLoading"/>

        <LoadButton v-if="newTasks.length > 0"
                    @click="mergeNewTasks($event)">
            Load new tasks
        </LoadButton>

        <LoadButton v-if="haveDeleted"
                    @click="mergeDeletedTasks($event)">
            Remove deleted tasks
        </LoadButton>

        <LoadButton v-if="haveUpdates"
                    @click="updateTasks($event)">
            You have updates
        </LoadButton>

        <NoTasksCard v-if="tasks.length == 0"/>

        <TaskCard v-for="task in tasks"
                  :key="task.id"
                  :id="task.id"
                  :name="task.name"
                  :description="task.description"
                  :date="task.dueTime"
                  :isCompleted="task.isCompleted"
                  :isDeleted="task.isDeleted"
                  @changeRoute="changeRoute($event)"
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
    import {Context, Group, Day, Uncategorized} from '../../services/strategy'
    import * as newTask$ from '../../event-buses/new-task'
    import * as refresh$ from '../../event-buses/refresh-tasks'
    import * as deleteTask$ from '../../event-buses/delete-task'
    import * as updateGroup$ from '../../event-buses/update-group'
    import * as updateTask$ from '../../event-buses/updated-task'
    import LoadingState from "../ui/LoadingState";
    import {responseHandler} from '../../services/response-handler'

    export default {
        name: 'TasksPage',
        components: {
            LoadingState,
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
                updatedTasks: [],
                group: {},
                userId: global.userState.loadId(),
                haveUpdates: false,
                haveDeleted: false,
                context: {},
                mode: '', // Groups, Daily, Uncategorized
                lastMode: '',
                isLoading: true
            }
        },
        methods: {
            setMode: function () {
                this.lastMode = this.mode
                this.mode = this.$route.meta.title
            },

            chooseStrategy: function () {
                const routeName = this.$route.meta.title
                const groupId = this.$route.params.groupId

                const strategies = new Map([
                    ['Groups', new Group(groupId)],
                    ['Daily', new Day(this.userId)],
                    ['Uncategorized', new Uncategorized(this.userId)]
                ])

                this.context = new Context(strategies.get(routeName))
            },

            initTasksOnRouteChange: async function () {
                const lastGroup = this.loadGroup()
                const currentMode = this.mode == 'Daily' || this.mode == 'Uncategorized'
                const lastMode = this.lastMode == 'Daily' || this.lastMode == 'Uncategorized'
                let initConditions = currentMode
                    || lastMode
                    || this.$route.params.groupId && lastGroup.id != this.$route.params.groupId
                if (initConditions) {
                    console.log('Loading tasks...')
                    await this.initTasks()
                }
            },

            initTasks: async function () {
                this.setMode()
                this.chooseStrategy()
                const response = await this.context.getTasks()
                const errorMessage = 'Could not load tasks.'
                responseHandler.handle(response, this.successfulTaskInit, errorMessage)
                this.isLoading = this.haveDeleted = this.haveUpdates = false
            },


            successfulTaskInit: function (response) {
                this.tasks = response.reverse()
            },

            mergeNewTasks: function () {
                this.tasks = [...this.newTasks.reverse(), ...this.tasks]
                this.newTasks = []
            },

            mergeDeletedTasks: function () {
                this.tasks = this.filterDeleted(this.tasks)
                this.updatedTasks = this.filterDeleted(this.updatedTasks)
                this.redirect()
                this.haveDeleted = false
            },

            filterDeleted: function (tasks) {
                return tasks.filter(task => !task.isDeleted)
            },

            redirect: function () {
                if (this.tasks.find(task => task.isDeleted && task.id == this.$route.params.taskId)) {
                    router.push({name: 'GroupInfo'})
                }
            },

            removeDeleted(id) {
                this.tasks = this.tasks.filter(task => task.id != id)
            },

            updateTasks() {
                this.initTasks()
                this.haveUpdates = false
                this.updatedTasks = []
                router.push({name: 'GroupInfo'})
            },

            markAsDeleted(id) {
                this.tasks = this.tasks.map(task => task.id == id ? {...task, isDeleted: true} : task)
            },

            // todo: rename to be more abstract, for any two arrays
            getDifference: function (taskMembers, groupMembers) {
                return groupMembers.map(gMember =>
                    taskMembers.find(tMember => tMember.id == gMember.id)
                        ? null
                        : gMember).filter(member => member)
            },

            changeRoute: function (taskid) {
                const path = this.$route.path
                const newPath = path.includes('tasks')
                    ? this.context.switchTask(path, taskid)
                    : this.context.changePath(path, taskid)
                router.push({path: newPath})
            },

            saveGroup: function () {
                if (this.mode == 'Daily' || this.mode == 'Uncategorized') {
                 //   this.removeLastActive()
                } else {
                    const groupId = this.$route.params.groupId
                    const group = global.groupState.loadSingle(groupId)
                    if (group) {
                        global.groupState.saveLastActiveGroup(group)
                    }
                }
            },

            loadGroup: function () {
                return global.groupState.loadLastActiveGroup()
            },

            removeLastActive: function () {
                global.groupState.removeLastActive()
            },

            bootstrap() {
                this.saveGroup()
            },

            checkIfExists(elements, task) {
                if (elements.length > 0) {
                    return elements.find(el => el.id == task.id) != undefined
                }
            },
        },

        watch: {
            $route() {
                this.setMode()
                this.initTasksOnRouteChange()
                this.bootstrap()
                this.group = this.loadGroup()
            }
        },
        created() {
            this.setMode()
            this.group = this.loadGroup()
            this.initTasks()
            this.bootstrap()

            newTask$.subscribe((newTask) => {
                this.newTasks.push(newTask)
            })

            deleteTask$.subscribe((deletedTask) => {
                if (this.userId == deletedTask.destructorId) {
                    this.removeDeleted(deletedTask.id)
                } else {
                    // not destructor app instance
                    const isInNew = this.checkIfExists(this.newTasks, deletedTask)
                    const isInUpdated = this.checkIfExists(this.updatedTasks, deletedTask)
                    if (isInNew) {
                        this.newTasks = this.newTasks.filter(newTask => newTask.id != deletedTask.id)
                    } else if (isInUpdated) {
                        this.updatedTasks = this.updatedTasks.filter(task => task.id != deletedTask.id)
                    } else {
                        this.markAsDeleted(deletedTask.id)
                        this.redirect()
                        this.haveDeleted = true
                    }
                }
            })

            updateTask$.subscribe((task) => {
                const isInNew = this.checkIfExists(this.newTasks, task)
                if (isInNew) {
                    this.newTasks = this.newTasks.map(newTask => newTask.id != task.id ? newTask : task)
                } else {
                    if (task.modifierId != this.userId) {
                        this.haveUpdates = true
                        this.updatedTasks.push(task)
                    } else {
                        this.tasks = this.tasks.map(t => t.id != task.id ? t : task)
                    }
                }
            })

            updateGroup$.subscribe((group) => {
                if (group.id == this.group.id) {
                    global.groupState.saveLastActiveGroup(group)
                }
                this.group = {...group}

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