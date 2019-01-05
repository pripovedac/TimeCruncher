<template>
    <div>
        <Sidebar :groups="groups"/>
        <!--<TaskCard name="Go to the market"-->
                  <!--description="U should buy some things, you know."-->
                  <!--date="04. 01. 2019"/>-->
        <TasksPage :tasks="tasks" groupName="Nabavka"/>
        <TaskInfo />
    </div>
</template>

<script>
    import PublicInput from "../ui/PublicInput"
    import TaskCard from "../ui/TaskCard"
    import Sidebar from "../ui/Sidebar";
    import TasksPage from "./TasksPage";
    import TaskInfo from "./TaskInfo";

    export default {
        name: "a",
        components: {TasksPage, Sidebar, TaskInfo, PublicInput},
        data() {
            return {
                groups: [
                    {
                        id: 1,
                        name: 'nabavka',
                        isPrivate: false
                    },
                    {
                        id: 2,
                        name: 'neopix',
                        isPrivate: true
                    },
                    {
                        id: 3,
                        name: 'faks',
                        isPrivate: false
                    },
                    {
                        id: 4,
                        name: 'selo',
                        isPrivate: true
                    },
                    {
                        id: 5,
                        name: 'teretana',
                        isPrivate: true
                    }
                ],
                tasks: [
                    {
                        id: 1,
                        name: 'Idea',
                        description: 'Mleko, sir, jogurt',
                        date: '14. 04. 1996.',
                        done: true
                    },
                    {
                        id: 2,
                        name: 'Pijaca',
                        description: 'Paradajz',
                        done: true,
                    },
                    {
                        id: 3,
                        name: 'Merkator',
                        description: 'Mleko',
                        date: '15. 04. 1996.'
                    },
                    {
                        id: 4,
                        name: 'Idea',
                        description: 'Mleko, sir, jogurt',
                        date: '14. 04. 1996.',
                        done: true
                    },
                    {
                        id: 5,
                        name: 'Idea',
                        description: 'Mleko, sir, jogurt',
                        date: '14. 04. 1996.'
                    },
                ]
            }
        }

    }
</script>

<style scoped lang="scss">
    div {
        display: flex;
    }

    .sidebar {
        width: 15%;
    }

    .tasks-page {
        width: 55%;
    }

    .task-info {
        width: 30%;
    }

</style>