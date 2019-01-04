<template>
    <div>
        <TaskCard name="Go to the market"
                  description="U should buy some things, you know."
                  date="04. 01. 2019"
        ></TaskCard>
    </div>
</template>

<script>
    import PublicInput from "../ui/PublicInput"
    import TaskCard from "../ui/TaskCard"

    export default {
        name: "a",
        components: {TaskCard, PublicInput}
    }
</script>

<style scoped lang="scss">
    /*div {*/
    /*border: 1px solid green;*/
    /*background-color: lightgreen;*/
    /*}*/

</style>