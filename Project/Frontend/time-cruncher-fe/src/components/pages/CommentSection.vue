<template>
    <div class="comment-section">
        <h1>{{this.task.name}}</h1>
        <div v-if="comments.length > 0" class="comment-list">
            <CommentCard v-for="comment in comments"
                         :key="comment.id"
                         :comment="comment"
                         @deleteComment="deleteComment($event)"

            />
        </div>
        <p v-else>No comments yet. Be the first!</p>
        <p>Add a comment: </p>
        <form @submit.prevent="postComment($event)">
            <textarea v-model="newComment"
                      @keyup.enter="postComment($event)"
                      rows="10"
                      spellcheck="false"/>
            <Button type="submit">Post</Button>
        </form>
        <p>Back to
            <router-link :to="{
                name: 'TaskInfo',
                params: {taskId: task.id},
                query: {comments: false}
                }" class="comments">
                task
            </router-link>
        </p>
    </div>
</template>

<script>
    import CommentCard from '../ui/CommentCard'
    import Button from '../ui/Button'
    import {userState} from '../../services/utilites'
    import * as commentsApi from '../../services/api/comments'
    import * as newComment$ from '../../event-buses/new-comment'

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
            postComment: async function () {
                const newComment = {
                    text: this.newComment,
                    creatorId: this.loadUserId(),
                    taskId: this.task.id
                }
                const response = await commentsApi.createNew(newComment)
                if (!response.errorStatus) {
                    this.newComment = ''
                } else {
                    // todo: handle errors
                    alert('Problem with posting comment.')
                }
            },

            deleteComment: async function (commentId) {
                this.$emit('deleteComment', commentId)
            },

            loadUserId: function () {
                return userState.loadId()
            }
        },
        created() {
            newComment$.subscribe((comment) => {
                this.comments.push(comment)
            })
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .comment-section {
        @include centerRowData(flex-start);
        align-items: flex-start;
        flex-direction: column;
        width: 100%;
        height: 100%;
        // todo: scroll is necessary
        /*overflow-y: scroll;*/
    }

    .comment-list {
        width: 100%;
    }

    .comment-card {
        width: 100%;
    }

    p {
        font-family: inherit;
        font-size: 0.8em;
    }

    form {
        width: 100%;

        + p {
            display: inline-block;
            margin: 0 auto;
            margin-top: 1em;
            font-size: 0.9em;

            a {
                color: $darkblue;
                text-decoration: none;
            }
        }


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