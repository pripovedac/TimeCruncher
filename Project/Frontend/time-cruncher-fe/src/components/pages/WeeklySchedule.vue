<template>
    <div class="weekly">
        <DayColumn name="Monday" :tasks="mondayTasks"/>
        <DayColumn name="Tuesday" :tasks="tuesdayTasks"/>
        <DayColumn name="Wednesday" :tasks="wednesdayTasks"/>
        <DayColumn name="Thursday" :tasks="thursdayTasks"/>
        <DayColumn name="Friday" :tasks="fridayTasks"/>
        <DayColumn name="Saturday" :tasks="saturdayTasks"/>
        <DayColumn name="Sunday" :tasks="sundayTasks"/>
    </div>
</template>

<script>
    import DayColumn from '../ui/DayColumn'
    import * as usersApi from '../../services/api/user'
    import {userState} from '../../services/utilites'

    export default {
        name: 'WeeklySchedule',

        components: {DayColumn},

        data() {
            return {
                userId: userState.loadId(),
                mondayTasks: [],
                tuesdayTasks: [],
                wednesdayTasks: [],
                thursdayTasks: [],
                fridayTasks: [],
                saturdayTasks: [],
                sundayTasks: []
            }
        },

        methods: {
            fetchWeeklyTasks: async function () {
                const response = await usersApi.getWeeklyTasks(this.userId)

                if (!response.errorStatus) {
                    this.mondayTasks = response[0].tasks
                    this.tuesdayTasks = response[1].tasks
                    this.wednesdayTasks = response[2].tasks
                    this.thursdayTasks = response[3].tasks
                    this.fridayTasks = response[4].tasks
                    this.saturdayTasks = response[5].tasks
                    this.sundayTasks = response[6].tasks
                } else {
                    // todo: handle errors
                    alert('Problem with fetching weekly tasks.')
                }
            },
        },

        created() {
            this.fetchWeeklyTasks()
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .weekly {
        display: flex;
        margin-left: 2em;
        border-top: 2px solid $lightblue;
    }
</style>