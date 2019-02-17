<template>
    <div class="register-page">
        <Paper>
            <h1>Time Cruncher</h1>
            <p>Feeling ready for some crunching? Try out Time Cruncher for free!</p>

            <form @submit.prevent="register($event)">
                <PublicInput v-model="user.firstname"
                             label="Name"
                             type="text"/>
                <PublicInput v-model="user.lastname"
                             label="Lastname"
                             type="text"/>
                <PublicInput v-model="user.email"
                             label="Email"
                             type="email"/>
                <PublicInput v-model="user.password"
                             label="Password"
                             type="password"/>
                <Button type="submit">Register</Button>
            </form>

            <p>Hm, you have an accout? Checkout our
                <router-link :to="{name: 'Login'}">Login page</router-link>
                .
            </p>
        </Paper>
    </div>
</template>

<script>
    import Paper from '../ui/Paper'
    import PublicInput from '../ui/PublicInput'
    import Button from '../ui/Button'
    import {userState} from '../../services/utilites'
    import router from '../../routes/routes'

    export default {
        name: "Register",
        components: {
            Paper,
            PublicInput,
            Button
        },
        data() {
            return {
                user: {
                    firstname: "",
                    lastname: "",
                    email: "",
                    password: ""
                },
            }
        },
        methods: {
            async register() {
                const newUser = {
                    firstname: this.user.firstname,
                    lastname: this.user.lastname,
                    email: this.user.email,
                    password: this.user.password
                }

                const response = await fetch(process.env.VUE_APP_BE_URL + `/register`, {
                    method: 'POST',
                    body: JSON.stringify(newUser),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {
                    const userData = await response.json()
                    userState.saveAT(userData.token)
                    userState.saveId(userData.user.id)
                    router.push({path: 'home'})
                } else {
                    alert('Registration did not go successfully.')
                }
            },

        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .register-page {
        height: 100vh;
        padding-top: 5vh;
        box-sizing: border-box;
        background: linear-gradient($lightblue, $darkblue);
    }

    h1 {
        margin: 0;
        color: #13547a;
    }

    p {
        margin-top: 1em;
        margin-bottom: 1em;
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
    }

    .public-input {
        margin-bottom: 1em;
        font-size: 1em;
        color: #13547a;
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