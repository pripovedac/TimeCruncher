<template>
    <div class="weekly">
        <div class="navigation">
            <button @click="decrementOffset($event)">
                <ArrowLeftCircleIcon class="icon"/>
            </button>
            <p>{{monday}}</p>
            <MinusIcon class="icon"/>
            <p>{{sunday}}</p>
            <button @click="incrementOffset($event)">
                <ArrowRightCircleIcon class="icon"/>
            </button>
        </div>
        <div class="daily-columns">
            <DayColumn name="Monday" :tasks="mondayTasks"/>
            <DayColumn name="Tuesday" :tasks="tuesdayTasks"/>
            <DayColumn name="Wednesday" :tasks="wednesdayTasks"/>
            <DayColumn name="Thursday" :tasks="thursdayTasks"/>
            <DayColumn name="Friday" :tasks="fridayTasks"/>
            <DayColumn name="Saturday" :tasks="saturdayTasks"/>
            <DayColumn name="Sunday" :tasks="sundayTasks"/>
        </div>
    </div>
</template>

<script>
    import DayColumn from '../ui/DayColumn'
    import * as usersApi from '../../services/api/user'
    import {dateController} from '../../services/date-transformations'
    import router from '../../routes/routes'
    import {userState} from '../../services/utilites'
    import {ArrowLeftCircleIcon, ArrowRightCircleIcon, MinusIcon} from 'vue-feather-icons'
    import {responseHandler} from '../../services/response-handler'

    export default {
        name: 'WeeklySchedule',

        components: {
            DayColumn,
            ArrowLeftCircleIcon,
            ArrowRightCircleIcon,
            MinusIcon
        },

        data() {
            return {
                userId: userState.loadId(),
                mondayTasks: [],
                tuesdayTasks: [],
                wednesdayTasks: [],
                thursdayTasks: [],
                fridayTasks: [],
                saturdayTasks: [],
                sundayTasks: [],
                monday: '',
                sunday: ''
            }
        },

        methods: {
            fetchWeeklyTasks: async function () {
                const response = await usersApi.getWeeklyTasks(this.userId)
                this.handleResponse(response)
            },

            calcDateRange: async function () {
                const offset = this.$route.query.offset
                if (typeof (offset) == 'number') {
                    let date = new Date()
                    const weekDays = 7
                    let today = date.getDay()
                    // Sunday check
                    today = today == 0 ? 7 : today
                    const weekOffset = offset * weekDays
                    let monday = new Date()
                    let sunday = new Date()
                    monday.setDate(date.getDate() + weekOffset - today + 1)
                    sunday.setDate(date.getDate() + weekOffset - today + weekDays)
                    this.monday = dateController.toInputFormat(monday)
                    this.sunday = dateController.toInputFormat(sunday)

                    const response = await usersApi.getSpecificWeekTasks(this.userId, this.monday)
                    this.handleResponse(response)
                    const errorMessage = 'Could not load weekly tasks.'
                    responseHandler.handle(response, this.successfulTaskGet, errorMessage)
                }
            },

            successfulTaskGet: function(response) {
                this.mondayTasks = response[0].tasks
                this.tuesdayTasks = response[1].tasks
                this.wednesdayTasks = response[2].tasks
                this.thursdayTasks = response[3].tasks
                this.fridayTasks = response[4].tasks
                this.saturdayTasks = response[5].tasks
                this.sundayTasks = response[6].tasks
            },

            incrementOffset: function() {
                const offset = parseInt(this.$route.query.offset) + 1
                router.push({name: 'Weekly', query: {offset: offset}})
            },

            decrementOffset: function() {
                const offset = parseInt(this.$route.query.offset) - 1
                router.push({name: 'Weekly', query: {offset: offset}})
            },

            bootstrap: function() {
                this.calcDateRange()
            }
        },

        watch: {
            $route: function () {
                this.bootstrap()
            }
        },
        created() {
            this.bootstrap()
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .weekly {
        display: flex;
        flex-direction: column;
        border-top: 2px solid $lightblue;
    }

    .navigation {
        display: flex;
        margin-left: 2em;
        align-items: center;

        button {
            @include remove(border, outline);
            background: none;
            cursor: pointer;
            :hover {
                color: $darkblue;
            }
        }
    }

    .icon {
        color: $lightblue;
    }

    .daily-columns {
        display: flex;
        margin-left: 2em;
    }
</style>