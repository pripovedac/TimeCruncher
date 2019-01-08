<template>
    <div class="new-group">
        <div class="content-container">
            <h1>Create a group</h1>
            <p>Group is a place where you can store your tasks. They are best when organized around a topic
                - #shopping, for example.
            </p>
            <form>
                <label class="label-checkbox">
                    <Checkbox/>
                    Is group private?
                </label>
                <PublicInput v-model="group.name"
                             label="Name"
                             type="text"/>
                <PublicInput v-model="group.description"
                             label="Description"
                             type="text"/>
                <PublicInput v-model="group.members"
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
                    members: "",
                    isPrivate: true,
                }

            }
        }
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