<template>
    <div class="new-task">
        <div class="content-container">
            <h1>Create a task in {{group.name}}</h1>
            <p>Task is something you should do whether it is for your company, or for yourself - "Buy some carrot",
                for example.
            </p>
            <form @submit.prevent="createTask($event)">
                <PublicInput v-model="task.name"
                             label="Name"
                             type="text"/>
                <label class="label-container">
                    Description
                    <textarea v-model="task.description"
                              rows="8"
                              spellcheck="false"
                              type="text"/>
                </label>
                <label class="label-select">
                    Members
                    <select @change="selectMember($event)">
                        <option value="">Member list</option>
                        <option v-for="member in task.members"
                                :key="member.id"
                                :value="member.id">
                            {{member.firstname + " " + member.lastname}}
                        </option>
                    </select>
                    <p v-if="selectedMembers.length == 0">
                        You haven't selected anyone yet.
                    </p>
                    <div v-else class="selected-members">
                        <p>You have selected:</p>
                        <MemberCard v-for="member in selectedMembers"
                                    :key="member.id"
                                    :firstname="member.firstname"
                                    :lastname="member.lastname"
                                    :id="member.id"
                                    @click="removeMember($event)"
                        >
                        </MemberCard>
                    </div>
                </label>
                <label class="label-container">
                    Due date:
                    <input type="date"
                           v-model="selectedDate"
                           :min="currentDate"
                    />
                </label>
                <Button type="submit"> Create task</Button>
                <Button @click="goBack($event)">
                    Cancel
                </Button>
            </form>
        </div>
    </div>
</template>

<script>
    import PublicInput from '../ui/PublicInput'
    import Button from '../ui/Button'
    import MemberCard from '../ui/MemberCard'
    import router from '../../routes/routes'
    import * as global from '../../services/utilites'
    import {dateController} from "../../services/dateTransformations";


    export default {
        name: 'NewTask',
        components: {
            PublicInput,
            Button,
            MemberCard,
        },
        data() {
            return {
                task: {
                    name: '',
                    description: '',
                    members: [],
                    isPrivate: true,
                },
                group: this.loadLastActiveGroup(),
                selectedDate: this.initDate(),
                currentDate: this.initDate(),
                memberNames: "",
                selectedMembers: [],
                userId: this.getUserId(),
            }
        },
        methods: {
            createTask: async function () {
                // todo: add publishTime, creatorId  or name, groupId
                // and task assignments
                const selectedMembers = this.selectedMembers.map(member => member.id)
                const date = new Date(this.selectedDate)

                const newTask = {
                    name: this.task.name,
                    description: this.task.description,
                    groupId: this.group.id,
                    creatorId: this.userId,
                    assignedUserIds: selectedMembers,
                    dueTime: date.toISOString()
                }

                const response = await fetch(process.env.VUE_APP_BE_URL + '/tasks', {
                    method: 'POST',
                    body: JSON.stringify(newTask),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {
                    // todo: redirect to new group without alert
                    alert('Successfully created task!')
                    this.goBack()
                } else {
                    alert('The task was not created. Check your entries.')
                }
            },

            initDate: function () {
                return this.getCurrentDate()
            },

            selectMember: function (event) {
                const memberId = event.target.value
                const newMember = this.task.members.find(({id}) => id == memberId)
                this.selectedMembers.push(newMember)
                this.task.members = this.task.members.filter(member => member.id != memberId)
            },

            removeMember: function (member) {
                const memberId = member.id
                this.task.members.push(member)
                this.selectedMembers = this.selectedMembers.filter(member => member.id != memberId)
            },

            initMembers: async function () {
                const response = await fetch(process.env.VUE_APP_BE_URL + `/groups/${this.group.id}/users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.ok) {
                    this.task.members = await response.json()
                }
            },

            loadLastActiveGroup: function () {
                return global.groupState.getLastActiveGroup()
            },

            getCurrentDate: function () {
                return dateController.initDate(new Date())
            },

            goBack() {
                // todo: change this to redirect
                router.go(-1)
            },

            getUserId: function () {
                return global.userState.load()
            }
        },

        created() {
            this.initMembers()
        }

    }
</script>

<style scoped lang="scss">
    $lightblue: #80d0c7;
    $darkblue: #13547a;

    .new-task {
        /*border: 3px solid green;*/
        display: block;
        /*width: 100%;*/
        height: 100vh;
        background-color: #fff;
        font-family: 'Montserrat', sans-serif;
    }

    .content-container {
        /*border: 1px solid black;*/
        width: 50%;
        /*height: 80vh;*/
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        padding: 3%;
        /*border: 1px solid black;*/
    }

    h1 {
        margin-top: 0;
    }

    p {
        font-size: 0.8em;
        padding-bottom: 2%;
        margin: 0;
    }

    label {
        display: flex;
        margin-bottom: 5%;
        font-family: inherit;
    }

    .label-container {
        display: flex;
        flex-direction: column;
        /*border: 1px solid blue;*/
        justify-content: center;
        align-self: center;
        font-size: 1em;
    }

    textarea {
        margin-top: 2%;
        resize: none;
        border: 1px solid #eee;
        outline: none;
        font-family: inherit;
    }

    .label-select {
        /*border: 1px solid green;*/
        display: flex;
        flex-direction: column;
        width: 100%;

        select {
            width: 40%;
            margin-top: 2%;
            padding: 1%;
            border: 1px solid #eee;
            outline: none;
        }

        p {
            color: darkgray;
            font-size: 0.7em;
        }

    }

    .selected-members {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        /*border: 2px solid blue;*/
        margin-top: 0.3em;
        display: flex;
        color: black;
        font-size: 0.7em;

        p {
            font-size: inherit;
            padding-bottom: 0;
            margin-right: 0.5em;
        }
    }

    .member-card {
        border: 2px solid $lightblue;
        width: 25%;
        margin: 0.2em;
    }

    input[type="date"] {
        width: 40%;
        /*border: 1px solid green;*/
        margin-top: 2%;
        font-family: inherit;
        outline: none;
        border: none;
    }

    .checkbox {
        margin-right: 2%;
    }

    .public-input {
        margin-bottom: 2em;
        font-size: 1em;
    }

    .primary-button {
        align-self: flex-end;

        + .primary-button {
            margin-left: 5%;
        }
    }

    a {
        text-decoration: none;
        color: white;
        outline: none;
    }
</style>