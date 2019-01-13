<template>
    <div class="no-tasks">
        <p>
            A whole lot of boring, right?
        </p>
        <p>
            Get things done. Be efficient. Stay busy. Achieve success.
        </p>
    </div>
</template>

<script>
    export default {
        name: 'NoTasksCard'
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .no-tasks {
        padding: 1em;
        border: 1px solid $lightblue;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
        font-family: inherit;
        font-size: inherit;
    }

</style>