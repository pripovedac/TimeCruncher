<template>
    <div class="login-page">
        <Paper>
            <h1>Time Cruncher</h1>
            <p>It's nice to see you again. Login and let's checkout tasks for today!</p>

            <form @submit.prevent="register($event)">
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

    export default {
        name: "Login",
        components: {
            Paper,
            PublicInput,
            Button
        },
        data() {
            return {
                user: {
                    email: "",
                    password: ""
                },
            }
        },
        methods: {
            register() {
                console.log('user: ', this.user)
            }
        }
    }
</script>

<style scoped lang="scss">
    $lightblue: #80d0c7;
    $darkblue: #13547a;

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
        display: flex;
        align-items: center;
        flex-direction: column;
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
        font-size: 1.2em;
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