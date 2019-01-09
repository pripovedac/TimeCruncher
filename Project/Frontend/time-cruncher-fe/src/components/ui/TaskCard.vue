<template>
    <div class="task-card" :class="{done: done, todo: !done}">
        <router-link :to="{path: '/login'}" >
            <CheckCircleIcon v-if="done"
                             class="icon"/>
            <InfoIcon v-else class="icon" />
        </router-link>
        <div class="task-data">
            <h1>{{name}}</h1>
            <p>{{description}}</p>
            <div v-if="date">{{displayedDate}}</div>
            <div v-else>Date undefined</div>
        </div>
    </div>
</template>

<script>
    import {CheckCircleIcon, InfoIcon} from 'vue-feather-icons'
    import {dateController} from "../../services/dateTransformations";

    export default {
        name: 'TaskCard',
        components: {
            CheckCircleIcon,
            InfoIcon
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
            },
            done: {
                type: Boolean
            }
        },
        computed: {
            displayedDate() {
                return dateController.initDate(new Date(this.date))
            },
        },
    }
</script>

<style scoped lang="scss">
    $ochre: #F5C52C;
    $green: #32CD32;

    .task-card {
        display: flex;
        background-color: #fff;
        width: 100%;
        box-sizing: border-box;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
    }

    a {
        display: flex;
        width: 10%;
        justify-content: center;
        align-items: center;
        padding: 1.5em;
        background-color: #fff;
    }

    .done {
        border: 1px solid $green;

        a {
            background-color: $green;
        }
    }

    .todo {
        border: 1px solid $ochre;

        a {
            background-color: $ochre;
        }
    }

    .icon {
        color: #fff;
    }

    .task-data {
        display: flex;
        flex-direction: column;
        width: 90%;
        padding: 0.5em;
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