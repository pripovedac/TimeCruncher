<template>
    <div class="task-card">
        <router-link :to="{path: '/login'}" class="to-do">
            <CheckCircleIcon class="icon"/>
        </router-link>
        <div class="task-data">
            <h1>{{name}}</h1>
            <p>{{description}}</p>
            <div>{{date}}</div>
        </div>
    </div>
</template>

<script>
    import {CheckCircleIcon} from 'vue-feather-icons'
    export default {
        name: 'TaskCard',
        components: {
            CheckCircleIcon
        },
        props: {
            id: {
                type: Number
            },
            name: {
                type: String
            },
            description: {
                type: String
            },
            date: {
                type: String
            }
        }
    }
</script>

<style scoped lang="scss">
    $ochre: #F5C52C;
    $green: #32CD32;

    .task-card {
        display: flex;
        background-color: #fff;
        width: 35%;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
    }

    a {
        display: flex;
        width: 2em;
        justify-content: center;
        align-items: center;
        padding: 1.5em;
        background-color: #fff;
    }

    .done {
        background-color: $green;
    }

    .to-do {
        background-color: $ochre;
    }

    .icon {
        color: #fff;
    }

    .task-data {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0.8em;
        border: 2px solid $ochre;
        font-size: inherit;
        font-family: inherit;

        :not(:last-child) {
            padding-bottom: 1em;
        }

        :last-child {
            align-self: flex-end;
            font-size: 0.8em;
        }
    }

    h1 {
        font-size: 1.2em;
    }

    p {
        font-size: 0.8em;
    }

    h1, p {
        margin: 0;
    }



</style>