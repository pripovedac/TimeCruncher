<template>
    <div class="comment-page">
        <h1>{{this.task.name}}</h1>
        <div v-if="comments.length > 0" class="comment-list">
            <CommentCard v-for="comment in comments"
                         :key="comment.id"
                         :comment="comment"
            />
        </div>
        <form @submit.prevent="postComment($event)">
            <textarea v-model="newComment" rows="10"/>
            <Button>Post</Button>
        </form>
    </div>
</template>

<script>
    import CommentCard from '../ui/CommentCard'
    import Button from '../ui/Button'

    export default {
        name: 'CommentPage',
        components: {
            CommentCard,
            Button,
        },

        props: {
            task: {
                type: Object,
                required: true,
            },
            comments: {
                type: Array,
                required: true,
            }
        },

        data() {
            return {
                newComment: '',
            }
        },

        methods: {
            postComment: function () {

            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .comment-section {
        @include centerRowData();
    }

    textarea {
        @include remove(outline, resize);

        width: 100%;
        border: 1px solid #eee;
        font-family: inherit;
        font-size: 0.8em;
    }

    .primary-button {
        display: block;
        margin: 0 auto;
        margin-top: 1em;
    }



</style>