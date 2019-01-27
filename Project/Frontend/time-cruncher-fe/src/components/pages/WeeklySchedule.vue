<template>
    <div class="weekly">
        <DayColumn name="Monday"/>
        <DayColumn name="Tuesday"/>
        <DayColumn name="Wednesday"/>
        <DayColumn name="Thursday"/>
        <DayColumn name="Friday"/>
        <DayColumn name="Saturday"/>
        <DayColumn name="Sunday"/>
    </div>
</template>

<script>
    import DayColumn from '../ui/DayColumn'

    export default {
        name: 'WeeklySchedule',

        components: {DayColumn},

        data() {
            return {}
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .weekly {
        display: flex;
        border-top: 2px solid $lightblue;
    }
</style>