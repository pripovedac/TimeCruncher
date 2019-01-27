<template>
    <div class="task-card" :class="{done: isCompleted, todo: !isCompleted, isLate: isLate}">
        <router-link :to="{name: 'TaskInfo',  params: {taskId: id} }">
            <CheckCircleIcon v-if="isCompleted"
                             class="icon"/>
            <AlertOctagonIcon v-else-if="isLate" class="icon"/>
            <InfoIcon v-else class="icon"/>
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
    import {CheckCircleIcon, InfoIcon, AlertOctagonIcon} from 'vue-feather-icons'
    import {dateController} from "../../services/date-transformations";

    export default {
        name: 'TaskCard',

        components: {
            CheckCircleIcon,
            InfoIcon,
            AlertOctagonIcon,
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
            isCompleted: {
                //type: Boolean
            },
        },

        computed: {
            displayedDate() {
                return dateController.toString(new Date(this.date))
            },
            isLate() {
                if (this.date) {
                    const yesterday = new Date()
                    yesterday.setDate(yesterday.getDate() - 1)
                    return new Date(this.date) < yesterday
                } else {
                    return false
                }
            },
        },
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

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
        @include centerRowData(center);
        width: 10%;
        padding: 1.5em;
        background-color: #fff;
    }

    // In this ordering.
    .todo {
        @include taskStatus($ochre);
    }

    .isLate {
        @include taskStatus($darkred);
    }

    .done {
        @include taskStatus($green);
    }

    .icon {
        color: #fff;
    }

    .task-data {
        @extend %flexColumn;
        width: 90%;
        padding: 0.5em;
        font-size: inherit;
        font-family: inherit;
        overflow: hidden;

        p {
            display: inline-block;
            @include handleOverflow();
        }

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