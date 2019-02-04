<template>
    <div class="blank-page">
        <p>Pick a task to see its details.</p>
    </div>
</template>

<script>
    export default {
        name: 'PlaceholderInfoPage',
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .blank-page {
        @include centerRowData('center');
        height: 100vh;
        /*width: 100%;*/
        /*align-items: center;*/
        padding-left: 1em;
        padding-right: 1em;
        background-color: #fff;
        border-left: 2px solid #eee;
    }
</style>