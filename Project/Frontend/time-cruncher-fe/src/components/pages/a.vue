<template>
    <div>
        <Sidebar />
        <!--<TaskCard name="Go to the market"-->
                  <!--description="U should buy some things, you know."-->
                  <!--date="04. 01. 2019"/>-->
    </div>
</template>

<script>
    import PublicInput from "../ui/PublicInput"
    import TaskCard from "../ui/TaskCard"
    import Sidebar from "../ui/Sidebar";

    export default {
        name: "a",
        components: {Sidebar, TaskCard, PublicInput}
    }
</script>

<style scoped lang="scss">
    /*div {*/
    /*border: 1px solid green;*/
    /*background-color: lightgreen;*/
    /*}*/

</style>