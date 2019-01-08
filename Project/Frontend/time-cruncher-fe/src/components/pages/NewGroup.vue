<template>
    <div class="new-group">
        <div class="content-container">
            <h1>Create a group</h1>
            <p>Group is a place where you can store your tasks. They are best when organized around a topic
                - #shopping, for example.
            </p>
            <form @submit.prevent="createGroup($event)">
                <label class="label-checkbox">
                    <Checkbox @changeState="updatePrivacy($event)"/>
                    Is group private?
                </label>
                <PublicInput v-model="group.name"
                             label="Name"
                             type="text"/>
                <PublicInput v-model="group.description"
                             label="Description"
                             type="text"/>
                <PublicInput v-model="group.member"
                             label="Members"
                             type="email"/>
                <Button type="submit"> Create group</Button>
                <Button>
                    <router-link :to="{path: '/home'}">Cancel</router-link>
                </Button>
            </form>
        </div>
    </div>
</template>

<script>
    import Checkbox from '../ui/Checkbox'
    import PublicInput from '../ui/PublicInput'
    import Button from '../ui/Button'
    import router from '../../routes/routes'

    export default {
        name: "NewGroup",
        components: {
            Checkbox,
            PublicInput,
            Button,
        },
        data() {
            return {
                group: {
                    name: "",
                    description: "",
                    member: "",
                    isPrivate: true,
                }

            }
        },
        methods: {
            createGroup: async function () {
                // todo: members and privacy should also be sent but currently are not due to BE limitations
                // todo: update input field for members
                console.log('isPrivate: ', this.group.isPrivate)

                const newGroup = {
                    name: this.group.name,
                    description: this.group.description,
                    creatorId: 91,
                    memberEmails: ['darko@carko']
                }

                const response = await fetch(process.env.VUE_APP_BE_URL + '/groups', {
                    method: 'POST',
                    body: JSON.stringify(newGroup),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {
                    alert('Successfully created group!')
                    router.go(-1)
                }

            },

            updatePrivacy(checkboxValue) {
                // todo: this should be refactored to use v-model directive
                this.group.isPrivate = checkboxValue
            }

        },
    }
</script>

<style scoped lang="scss">

    .new-group {
        /*border: 3px solid green;*/
        display: block;
        /*width: 100%;*/
        height: 100vh;
        background-color: #fff;
        font-family: 'Montserrat', sans-serif;
    }

    .content-container {
        width: 50%;
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
        padding-bottom: 3%;
    }

    label {
        display: flex;
        margin-bottom: 5%;
        font-family: inherit;
    }

    .label-checkbox {
        display: flex;
        /*border: 1px solid blue;*/
        justify-content: center;
        align-self: center;
    }

    .checkbox {
        margin-right: 2%;
    }

    .public-input {
        margin-bottom: 2em;
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