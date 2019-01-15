<template>
    <div class="login-page">
        <Paper>
            <h1>Time Cruncher</h1>
            <p>It's nice to see you again. Login and let's checkout tasks for today!</p>

            <form @submit.prevent="login($event)">
                <PublicInput v-model="user.email"
                             label="Email"
                             type="email">
                </PublicInput>
                <PublicInput v-model="user.password"
                             label="Password"
                             type="password">
                </PublicInput>
                <Button type="submit">Login</Button>
            </form>

            <p>You don't have an account? You can fix that at our
                <router-link :to="{name: 'Register'}">Register page</router-link>
                .
            </p>
        </Paper>
    </div>
</template>

<script>
    import Paper from '../ui/Paper'
    import PublicInput from '../ui/PublicInput'
    import Button from '../ui/Button'
    import * as global from '../../services/utilites'
    import router from '../../routes/routes'

    export default {
        name: 'Login',
        components: {
            Paper,
            PublicInput,
            Button
        },
        data() {
            return {
                user: {
                    email: 'thefirstpresenter@gmail.com',
                    password: 'daretovasifra'
                },
            }
        },
        methods: {
             login: async function() {
                const newUser = {
                    email: this.user.email,
                    password: this.user.password
                }

                const response = await fetch(process.env.VUE_APP_BE_URL + `/login`, {
                    method: 'POST',
                    body: JSON.stringify(newUser),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {
                    const userData = await response.json()
                    const filteredData = {
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        accessToken: userData.accessToken.token,
                        id: userData.id
                    }
                    this.saveData(filteredData)
                    const group = global.groupState.loadLastActiveGroup()
                    group
                        ? router.push({name: 'GroupInfo', params: {groupId: group.id}})
                        : router.push('/home')
                } else {
                    alert('Check your credentials, please')
                }
            },

            saveData: function (data) {
                global.userState.save(data)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .login-page {
        height: 100vh;
        padding-top: 5vh;
        background: linear-gradient($lightblue, $darkblue);
    }

    h1 {
        margin: 0;
        color: #13547a;
    }

    p {
        margin-top: 1.5em;
        margin-bottom: 3em;
    }

    .paper {
        @extend %flexColumn;

        align-items: center;
        margin: 0 auto;
        font-family: 'Montserrat', sans-serif;
        max-width: 26rem;
        min-height: 32em;
        padding: calc(1.5em + 1.2vw);
        padding-bottom: 2rem;
        text-align: center;
    }

    form {
        width: 100%;
        margin-bottom: 2em;
    }

    .public-input {
        margin-bottom: 1em;
        font-size: 1em;
        color: #13547a;
    }

    .primary-button {
        margin-top: 2em;
    }

    form + p {
        margin-top: 1em;
        margin-bottom: 0;
    }

    a {
        text-decoration: none;
        color: #13547a;
    }
</style>