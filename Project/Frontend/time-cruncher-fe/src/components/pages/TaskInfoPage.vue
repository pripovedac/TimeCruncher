<template>
    <div class="task-info" v-if="!$route.query.comments">
        <form @submit.prevent="updateTask($event)">
            <h1>
                <input aria-label="title" placeholder="Task name"
                       v-model="task.name"
                       spellcheck="false"/>
            </h1>

            <div class="top-data">
                <label class="label-container">
                    Due date:
                    <input type="date"
                           v-model="dueTime"/>
                </label>
                <label class="label-container">
                    <p>Is task completed?</p>
                    <Checkbox @changeState="changeState($event)" :checked="task.isCompleted"/>
                </label>
            </div>

            <div class="description-container">
                <h2>
                    <AlignLeftIcon class="icon"/>
                    Description
                </h2>
                <textarea placeholder="Description"
                          v-model="task.description"
                          rows="5"
                          spellcheck="false"
                />
            </div>

            <div class="members">
                <h2>
                    <UsersIcon class="icon"/>
                    Members
                </h2>
                <select @change="selectMember($event)">
                    <option value="">Member list</option>
                    <option v-for="member in groupMembers"
                            :key="member.id"
                            :value="member.id">
                        {{member.firstname + " " + member.lastname}}
                    </option>
                </select>
                <div class="selected-members">
                    <MemberCard v-for="member in taskMembers"
                                :key="member.id"
                                :firstname="member.firstname"
                                :lastname="member.lastname"
                                :id="member.id"
                                @click="removeMember($event)">
                    </MemberCard>
                </div>
            </div>

            <div class="task-info-section">
                <p>Published on: {{publishTime}}</p>
                <p>Created by: {{task.creatorName}}</p>
                <p v-if="task.completionTime">Closed on: {{completionTime}}</p>
            </div>
            <div class="danger-zone">
                <h2>
                    <Trash2Icon class="icon"/>
                    Danger zone
                </h2>
                <div class="delete-container">
                    <p>Delete this task</p>
                    <DeleteButton @click="deleteTask($event)">
                        Delete
                    </DeleteButton>
                </div>
            </div>

            <button type="submit">Submit</button>
        </form>
        <p>Go to
            <router-link :to="{
                name: 'TaskInfo',
                params: {taskId: task.id},
                query: {comments: true}
                }" class="comments">
                comment section
            </router-link>
        </p>
    </div>

    <div v-else class="task-info">
        <CommentSection :task="task"
                        :comments="comments"
                        @deleteComment="deleteComment($event)"
        />
    </div>

</template>

<script>
    import Checkbox from '../ui/Checkbox'
    import MemberCard from '../ui/MemberCard'
    import CommentSection from './CommentSection'
    import DeleteButton from '../ui/DeleteButton'
    import {AlignLeftIcon, UsersIcon, Trash2Icon} from 'vue-feather-icons'
    import router from '../../routes/routes'
    import {dateController} from '../../services/date-transformations'
    import * as global from '../../services/utilites'
    import * as tasksApi from '../../services/api/tasks'
    import * as groupsApi from '../../services/api/groups'
    import * as commentsApi from '../../services/api/comments'
    import * as refresh$ from '../../event-buses/refresh-tasks'

    export default {
        name: 'InfoPage',
        components: {
            Checkbox,
            MemberCard,
            CommentSection,
            AlignLeftIcon,
            UsersIcon,
            DeleteButton,
            Trash2Icon,
        },

        data() {
            return {
                taskMembers: [],
                groupMembers: [],
                group: this.loadLastActiveGroup(),
                task: {},
                publishTime: {},
                completionTime: {},
                dueTime: {},
                comments: [],
            }
        },
        methods: {
            init: async function () {
                await this.fetchTask()
                await this.fetchTaskMembers()
                await this.fetchGroupMembers()
                await this.fetchComments()
            },

            updateTask: async function () {
                const selectedMembers = this.taskMembers.map(member => member.id)

                const newTask = {
                    name: this.task.name,
                    description: this.task.description,
                    isCompleted: this.task.isCompleted,
                    dueTime: this.dueTime,
                    assignedUserIds: selectedMembers,
                }
                await tasksApi.updateSingle(this.task.id, newTask)
                refresh$.publish()
            },

            selectMember: function (event) {
                const memberId = event.target.value
                const newMember = this.groupMembers.find(({id}) => id == memberId)
                this.taskMembers.push(newMember)
                this.groupMembers = this.groupMembers.filter(member => member.id != memberId)
            },

            removeMember: function (member) {
                this.taskMembers = this.taskMembers.filter(tMember => tMember.id != member.id)
                // todo: sort by name
                this.groupMembers.push(member)
            },

            changeState: function () {
                this.task.isCompleted = !this.task.isCompleted
            },

            fetchTask: async function () {
                // todo: this shouldn't be BE connected
                console.log('Fetching task...')
                const taskId = this.$route.params.taskId
                const response = await tasksApi.getSingleTask(taskId)

                if (!response.errorStatus) {
                    this.task = response
                    this.publishTime = dateController.toInputFormat(new Date(this.task.publishTime))
                    this.completionTime = dateController.toInputFormat(new Date(this.task.completionTime))
                    this.dueTime = dateController.toString(new Date(this.task.dueTime))
                } else {
                    // todo: handle errors
                    alert('Problem with loading single task.')
                }
            },

            fetchTaskMembers: async function () {
                const id = this.$route.params.taskId
                const response = await tasksApi.getMembers(id)

                if (!response.errorStatus) {
                    this.taskMembers = response
                } else {
                    alert('Problem with fetching task members.')
                }
            },

            fetchGroupMembers: async function () {
                const id = this.task.groupId
                const response = await groupsApi.getMembers(id)
                if (!response.errorStatus) {
                    this.groupMembers = this.getDifference(this.taskMembers, response)
                } else {
                    alert('Problem with fetching group members.')
                }
            },

            fetchComments: async function () {
                const id = this.$route.params.taskId
                const response = await commentsApi.getComments(id)
                if (!response.errorStatus) {
                    this.comments = response
                } else {
                    alert('Problem with fetching comments.')
                }
            },

            getDifference: function (taskMembers, groupMembers) {
                return groupMembers.map(gMember =>
                    taskMembers.find(tMember => tMember.id == gMember.id)
                        ? null
                        : gMember).filter(member => member)
            },

            deleteTask: async function () {
                const shouldDelete = confirm(`Are you sure you want to delete task ${this.task.name}?`)
                if (shouldDelete) {
                    const response = await tasksApi.deleteSingle(this.task.id)
                    if (!response.errorStatus) {
                        router.push({name: 'GroupInfo', params: {groupId: this.group.id}})
                        // removeGroup$.publish(this.group.id)
                    } else {
                        alert('Problem with fetch members.')
                    }
                }
            },

            deleteComment: async function (commentId) {
                const response = await commentsApi.deleteSingle(commentId)
                if (!response.errorStatus) {
                    this.comments = this.comments.filter(comment => comment.id != commentId)
                } else {
                    // todo: handle errors
                    alert('Problem with deleting comment.')
                }
            },

            loadLastActiveGroup: function () {
                return global.groupState.loadLastActiveGroup()
            }
            ,
        },
        watch: {
            $route: function () {
                this.init()
            }
        }
        ,
        created: function () {
            this.init()
        }
        ,
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .task-info {
        @extend %flexColumn;
        height: 100vh;
        padding-left: 1em;
        padding-right: 1em;
        background-color: #fff;
        border-left: 2px solid #eee;
        overflow-y: auto;
    }

    form {
        @extend %flexColumn;
        height: 95vh;
        background-color: #fff;

    }

    input, textarea {
        @include remove(border, outline);
        width: 100%;
        font-family: inherit;
    }

    h1 {
        font-size: 1.4em;
        font-weight: bold;

        input {
            text-overflow: ellipsis;
            font-size: 1.5em;
            font-weight: bold;
        }
    }

    h2 {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }

    .label-container {
        @include centerRowData();
        margin-bottom: 0.5em;
        font-size: 1em;
        align-items: center;
    }

    input[type="date"] {
        @include remove(border, outline);
        width: 40%;
        font-family: inherit;
        font-weight: normal;
        font-size: 1em;
    }

    // dates and creator name
    .top-data {
        font-size: 0.8em;
    }

    p {
        margin-top: 0;
        margin-bottom: 0;
        font-size: inherit;
    }

    // Due date container
    p + label {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        margin-bottom: 1em;
        font-size: inherit;

        // Due date value
        > input {
            width: 70%;
            margin-left: 0.5em;
            font-size: inherit;
            font-weight: normal;
            font-size: 1em;
        }
    }

    .description-container {
        width: 100%;
        h2 {
            margin-top: 0;
        }

        textarea {
            width: 98%;
        }
    }

    textarea {
        resize: none;
    }

    .members {
        @extend %flexColumn;
        // todo: overflow, maxwidth
        select {
            width: 40%;
            margin-bottom: 0.5em;
            padding: 1%;
            border: 1px solid #eee;
            outline: none;
        }
    }

    .selected-members {
        display: flex;
        flex-wrap: wrap;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }

    .member-card {
        width: 35%;
        display: flex;
        align-items: center;
        margin-bottom: 0.5em;
        margin-right: 0.5em;
        font-size: 0.7em;
        border: 1px solid $lightblue;
    }

    // remove member button
    button {
        @include remove(border, outline);
        display: flex;
        align-items: center;
    }

    h2 {
        display: flex;
        align-items: center;
        font-size: 1.2em;
    }

    .checkbox {
        margin-left: 0.8em;
        /*margin-bottom: 1em;*/
    }

    .icon {
        padding-right: 0.5em;
        width: 1em;
    }

    .task-info-section {
        height: 10vh;
        p {
            font-size: 0.8em;
            /*border: 1px solid red;*/
            margin-top: 0;
            margin-bottom: 0.4em;
        }
    }


    .danger-zone {
        box-sizing: border-box;
    }

    .delete-container {
        @include centerRowData(space-between);
        margin-bottom: 0.5em;
        font-size: 0.9em;

        p {
            margin-bottom: 0;
        }

        .delete-button {
            width: 25%;
            font-size: 0.8em;
        }
    }

    button[type="submit"] {
        @include remove(border, outline);
        display: block;
        width: 30%;
        margin-top: 0;
        padding: 1em;
        align-self: center;
        font-family: inherit;
        font-weight: bold;
        font-size: 0.92em;
        letter-spacing: 1px;
        text-align: center;
        text-transform: uppercase;
        color: white;
        background: linear-gradient($lightblue, $darkblue);
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }

    form + p {
        width: 100%;
        margin-top: 0.5em;
        text-align: center;
        font-size: 0.9em;

        a {

            color: $darkblue;
            text-decoration: none;
        }
    }

    textarea {
        border: 1px solid #eee;
    }

</style>