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
                <PublicInput v-if="!group.isPrivate"
                             v-model="task.members"
                             label="Members"
                             type="email"/>
                <label class="label-container">
                    Due date:
                    <input type="date"
                           :value="currentDate"
                           :min="currentDate"
                    />
                </label>
                <Button type="submit"> Create task</Button>
                <Button>
                    <router-link :to="{path: '/home'}">Cancel</router-link>
                </Button>
            </form>
        </div>
    </div>
</template>

<script>
    import PublicInput from '../ui/PublicInput'
    import Button from '../ui/Button'

    export default {
        name: 'NewTask',
        components: {
            PublicInput,
            Button,
        },
        data() {
            return {
                task: {
                    name: '',
                    description: '',
                    members: '',
                    isPrivate: true,
                },
                group: {
                    name: 'Nabavka',
                    isPrivate: false
                },
                currentDate: this.initDate(),

            }
        },
        methods: {
            createTask: function () {
                // todo: add publishTime, creatorId  or name, groupId
                // and task assignments
            },
            initDate: function() {
                const today = new Date()
                const year = today.getFullYear()
                let month = today.getMonth() + 1
                month = month < 10 ? `0${month}` : month
                let day = today.getDate()
                day = day < 10 ? `0${day}` : day
                return `${year}-${month}-${day}`
            }
        },
        created() {
            this.initDate()
        }
    }
</script>

<style scoped lang="scss">

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