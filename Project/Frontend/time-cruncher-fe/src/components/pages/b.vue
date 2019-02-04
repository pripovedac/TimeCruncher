<template>
    <div>
        <PlaceholderInfoPage />
    </div>
</template>

<script>
    import MemberCard from "../ui/MemberCard";
    import LoadButton from "../ui/LoadButton";
    import NoTasksCard from "../ui/NoTasksCard";
    import CommentCard from "../ui/CommentCard";
    import DayColumn from "../ui/DayColumn";
    import PlaceholderInfoPage from "./PlaceholderInfoPage";

    export default {
        name: "b",
        components: {PlaceholderInfoPage, DayColumn, CommentCard, NoTasksCard, LoadButton, MemberCard},
        data() {
            return {
                comment: {
                    text: 'Lorem ipsum dolor',
                    creator: {
                        firstname: 'Darko',
                        lastname: 'Stevanovic',
                    },
                    postTime: new Date().toISOString()
                },
                tasks1: [
                    {
                        completionTime: null,
                        description: "test dest",
                        dueTime: "2019-01-11T00:00:00.000Z",
                        id: 40,
                        isCompleted: 1,
                        name: "pusher test",
                        publishTime: "2019-01-10T23:25:57.942Z",
                        groupId: 66,
                    }, {
                        completionTime: null,
                        description: "1233333333",
                        dueTime: "2019-01-11T00:00:00.000Z",
                        id: 41,
                        isCompleted: 0,
                        name: "123",
                        publishTime: "2019-01-10T23:26:19.211Z",
                        groupId: 66,
                    }, {
                        completionTime: null,
                        description: "23423432",
                        dueTime: "2019-01-11T00:00:00.000Z",
                        id: 3212,
                        isCompleted: 0,
                        name: "324324",
                        publishTime: "2019-01-10T23:28:22.024Z",
                        groupId: 66,
                    },
                    {
                        completionTime: null,
                        description: "test dest",
                        dueTime: "2019-01-11T00:00:00.000Z",
                        id: 980,
                        isCompleted: 1,
                        name: "pusher test",
                        publishTime: "2019-01-10T23:25:57.942Z",
                        groupId: 66,
                    }, {
                        completionTime: null,
                        description: "1233333333",
                        dueTime: "2019-01-11T00:00:00.000Z",
                        id: 331,
                        isCompleted: 0,
                        name: "123",
                        publishTime: "2019-01-10T23:26:19.211Z",
                        groupId: 66,
                    }, {
                        completionTime: null,
                        description: "23423432",
                        dueTime: "2019-01-11T00:00:00.000Z",
                        id: 42,
                        isCompleted: 0,
                        name: "324324",
                        publishTime: "2019-01-10T23:28:22.024Z",
                        groupId: 66,
                    }
                ],
                tasks2: [
                    {
                        completionTime: null,
                        description: "test dest",
                        dueTime: "2019-01-11T00:00:00.000Z",
                        id: 410,
                        isCompleted: 1,
                        name: "pusher test",
                        publishTime: "2019-01-10T23:25:57.942Z",
                        groupId: 66,
                    }, {
                        completionTime: null,
                        description: "1233333333",
                        dueTime: "2019-01-11T00:00:00.000Z",
                        id: 411,
                        isCompleted: 0,
                        name: "123",
                        publishTime: "2019-01-10T23:26:19.211Z",
                        groupId: 66,
                    }, {
                        completionTime: null,
                        description: "23423432",
                        dueTime: "2019-01-11T00:00:00.000Z",
                        id: 421,
                        isCompleted: 0,
                        name: "324324",
                        publishTime: "2019-01-10T23:28:22.024Z",
                        groupId: 66,
                    },

                ]


            }
        }
    }
</script>

<style scoped>
    div {
        display: flex;
        width: calc(7 * 210vw);
    }
    
</style>