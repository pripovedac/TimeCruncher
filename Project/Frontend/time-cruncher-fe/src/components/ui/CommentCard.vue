<template>
    <div class="comment-card">
        <div class="top-header">
            <span>{{comment.creator.firstname}} {{comment.creator.lastname}}</span>
            <div class="date-and-delete">
                <p>{{postTime}}</p>
                <button v-if="comment.creator.id == currentUserId"
                        @click="deleteComment($event)"
                        type="button"
                       >
                    <Trash2Icon class="icon"/>
                </button>
            </div>
        </div>
        <div class="comment-text">{{comment.text}}</div>
    </div>
</template>

<script>
    import {userState} from '../../services/utilites'
    import {dateController} from '../../services/date-transformations'
    import {Trash2Icon} from 'vue-feather-icons'

    export default {
        name: 'CommentCard',

        components: {
            Trash2Icon,
        },

        props: {
            comment: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                postTime: dateController.toString(new Date(this.comment.postTime)),
                currentUserId: userState.loadId()
            }
        },

        methods: {
            deleteComment: function () {
                this.$emit('deleteComment', this.comment.id)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .comment-card {
        @extend %flexColumn;
        border: 1px solid #eee;
        box-sizing: border-box;
        padding-left: 0.4em;
        padding-right: 0.4em;
        padding-bottom: 0.4em;
        overflow: hidden;
    }

    .top-header {
        @include centerRowData(space-between);
        font-size: 0.8em;
    }
    
    .date-and-delete {
        display: flex;

        button {
            @include centerRowData(center);
            padding: 0;
            margin: 0;
            border: none;
            margin-left: 0.5em;
            background-color: white;
            color: black;
            cursor: pointer;
        }

        button:hover {
            color: $darkred;
        }

        .icon {
            width: 1.1em;
        }
    }

    .comment-text {
        width: 100%;
        word-wrap: break-word;
        font-family: inherit;
        font-size: 0.8em;
    }

</style>