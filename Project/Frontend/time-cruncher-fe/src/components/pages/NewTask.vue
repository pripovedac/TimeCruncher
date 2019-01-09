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
                            {{member.name}}
                        </option>
                    </select>
                    <p v-if="selectedMembers.length == 0">
                        You haven't selected anyone yet.
                    </p>
                    <div v-else class="selected-members">
                        <p>You have selected:</p>
                        <MemberCard v-for="member in selectedMembers"
                                    :key="member.id"
                                    :name="member.name"
                                    :id="member.id"
                                    @click="removeMember($event)"
                        >
                        </MemberCard>
                    </div>
                </label>
                <label class="label-container">
                    Due date:
                    <input type="date"
                           :value="currentDate"
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
                    members: [
                        {
                            name: 'Darko Stevanovic',
                            id: 91,
                        },
                        {
                            name: 'Milos Stanojevic',
                            id: 95,
                        },
                        {
                            name: 'Janko Jankovic',
                            id: 96,
                        },
                        {
                            name: 'Jovica Mirkovic',
                            id: 4
                        },
                        {
                            name: 'Milica Milovanovic',
                            id: 5
                        },
                        {
                            name: 'Jovica Mirkovic',
                            id: 14
                        },
                        {
                            name: 'Milica Milovanovic',
                            id: 15
                        },
                    ],
                    isPrivate: true,
                },
                group: {
                    name: 'Nabavka',
                    isPrivate: false
                },
                currentDate: this.initDate(),
                memberNames: "",
                selectedMembers: [],
            }
        },
        methods: {
            createTask: function () {
                // todo: add publishTime, creatorId  or name, groupId
                // and task assignments
            },

            initDate: function () {
                const today = new Date()
                const year = today.getFullYear()
                let month = today.getMonth() + 1
                month = month < 10 ? `0${month}` : month
                let day = today.getDate()
                day = day < 10 ? `0${day}` : day
                return `${year}-${month}-${day}`
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

            goBack() {
                router.go(-1)
            },

        },

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
        padding: 1%;
        /*border: 1px solid black;*/
    }

    h1 {
        margin-top: 0;
    }

    p {
        font-size: 0.8em;
        padding-bottom: 3%;
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