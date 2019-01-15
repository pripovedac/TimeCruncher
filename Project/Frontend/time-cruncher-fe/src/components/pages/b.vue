<template>
    <CommentCard :comment="comment"/>
</template>

<script>
    import MemberCard from "../ui/MemberCard";
    import LoadButton from "../ui/LoadButton";
    import NoTasksCard from "../ui/NoTasksCard";
    import CommentCard from "../ui/CommentCard";
    export default {
        name: "b",
        components: {CommentCard, NoTasksCard, LoadButton, MemberCard},
        data() {
            return {
                comment: {
                    text: 'Lorem ipsum dolor',
                    creator: {
                        firstname: 'Darko',
                        lastname: 'Stevanovic',
                    },
                    postTime: new Date().toISOString()
                }
            }
        }
    }
</script>

<style scoped>

</style>