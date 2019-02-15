<template>
    <div class="modify-user">
        <div class="content-container">
            <h1>User details</h1>
            <p>Looks like you want to chek out your details.
                Feeling that you should change something?
            </p>
            <form @submit.prevent="updateUser($event)">
                <PublicInput v-model="user.firstname"
                             label="Firstname"
                             type="text"/>
                <PublicInput v-model="user.lastname"
                             label="Lastname"
                             type="text"/>
                <PublicInput v-model="user.email"
                             label="Email"
                             type="text"/>
                <PublicInput v-model="user.password"
                             label="New password"
                             type="text"/>
                <Button type="submit">Update info</Button>
                <Button @click="goBack($event)">
                    Cancel
                </Button>
            </form>
            <div class="danger-zone">
                <h2>
                    <Trash2Icon class="icon"/>
                    Danger zone
                </h2>
                <div class="delete-container">
                    <p>Delete your account</p>
                    <DeleteButton>Delete</DeleteButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PublicInput from '../ui/PublicInput'
    import Button from '../ui/Button'
    import router from '../../routes/routes'
    import * as global from '../../services/utilites'
    import * as userApi from '../../services/api/user'
    import DeleteButton from '../ui/DeleteButton'
    import {Trash2Icon} from 'vue-feather-icons'

    export default {
        name: 'ModifyUserPage',
        components: {
            DeleteButton,
            PublicInput,
            Button,
            Trash2Icon,
        },
        data() {
            return {
                user: {},
            }
        },
        methods: {
            bootstrap: async function () {
                this.user = await this.fetchUser()
            },

            fetchUser: async function () {
                return await userApi.getUser(this.getUserId())
            },

            updateUser: async function () {
                let updatedUser = {
                    firstname: this.user.firstname,
                    lastname: this.user.lastname,
                    email: this.user.email
                }

                updatedUser = this.user.password
                ? {...updatedUser, password: this.user.password}
                : updatedUser


                const response = await userApi.updateUser(this.getUserId(), updatedUser)

                if (!response.errorStatus) {
                    alert('Successfully updated infos!')
                    this.goBack()
                } else {
                    alert('Problem with update.')
                }
            },

            goBack: function () {
                router.go(-1)
            },

            getUserId: function () {
                return global.userState.loadId()
            }
        },
        created() {
            this.bootstrap()
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .modify-user {
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
        margin-bottom: 0;
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
        margin-bottom: 1.5em;
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
        font-size: 0.8em;
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



    .danger-zone {
        box-sizing: border-box;

        h2 {
            @include centerRowData(flex-start);
            color: $darkred;

            .icon {
                margin-right: 0.3em;
            }
        }
    }

    .delete-container {
        @include centerRowData(space-between);
        margin-bottom: 0.5em;
        font-size: 0.9em;

        p {
            font-size: 1em;
            margin-bottom: 0;
        }

        .delete-button {
            width: 25%;
            font-size: 0.8em;
        }
    }
</style>