<template>
    <div class="new-group">
        <div class="content-container">
            <h1>Create a group</h1>
            <p>Group is a place where you can store your tasks. They are best when organized around a topic
                - #shopping, for example.
            </p>
            <form @submit.prevent="createGroup($event)">
                <label class="label-checkbox">
                    <Checkbox :checked="group.isPrivate"
                              @changeState="updatePrivacy($event)"/>
                    Is group private?
                </label>
                <PublicInput v-model="group.name"
                             label="Name"
                             type="text"/>
                <PublicInput v-model="group.description"
                             label="Description"
                             type="text"/>
                <label class="label-container" v-if="!group.isPrivate">
                    Members
                    <textarea v-model="group.members"
                              rows="8"
                              spellcheck="false"
                              type="text"
                              :disabled="group.isPrivate"
                    />
                    <span>Please separate multiple addresses with single space.</span>
                </label>
                <Button type="submit" :disabled="!group.name.length"> Create group</Button>
                <Button @click="goBack($event)">
                    Cancel
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
    import * as global from '../../services/utilites'
    import * as groupsApi from '../../services/api/groups'

    export default {
        name: 'NewGroup',
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
                    isPrivate: false,
                },
                userId: this.getUserId()
            }
        },
        methods: {
            createGroup: async function () {
                const memberMails = this.separateMails(this.group.members)
                const newGroup = {
                    name: this.group.name,
                    description: this.group.description,
                    creatorId: this.userId,
                    memberEmails: memberMails[0].length ? memberMails : [],
                    isPrivate: this.group.isPrivate
                }

                const response = await groupsApi.createNew(newGroup)

                if (!response.errorStatus) {
                    alert('Successfully created group!')
                    this.goBack()
                } else {
                    alert('Problem with creating group.')
                }
            },

            updatePrivacy: function (checkboxValue) {
                // todo: this should be refactored to use v-model directive
                this.group.isPrivate = checkboxValue
            },

            separateMails: function (mails) {
                return mails.split(' ')
            },

            goBack: function () {
                router.go(-1)
            },

            getUserId: function () {
                return global.userState.loadId()
            }
        },
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .new-group {
        display: block;
        height: 100vh;
        background-color: #fff;
        font-family: 'Montserrat', sans-serif;
    }

    .content-container {
        @extend %flexColumn;

        width: 50%;
        margin: 0 auto;
        padding: 1%;
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
        @include centerRowData();
    }

    .checkbox {
        margin-right: 2%;
    }

    .public-input {
        margin-bottom: 2em;
    }

    .label-container {
        @extend %flexColumn;

        justify-content: center;
        align-self: center;
        font-size: 1em;

        span {
            margin-top: 0.3em;
            color: darkgray;
            font-size: 0.7em;
        }

    }

    textarea {
        @include remove(resize, outline);

        margin-top: 2%;
        border: 1px solid #eee;
        font-family: inherit;
    }

    textarea[disabled] {
        background-color: white;
        cursor: not-allowed;
    }

    .primary-button {
        align-self: flex-end;

        + .primary-button {
            margin-left: 5%;
        }
    }

    a {
        @include remove(text-decoration, outline);

        text-decoration: none;
        color: white;
        outline: none;
    }
</style>