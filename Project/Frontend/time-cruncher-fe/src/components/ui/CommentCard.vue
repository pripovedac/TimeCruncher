<template>
    <div class="comment-card">
        <div class="top-header">
            <span>{{comment.creator.firstname}} {{comment.creator.lastname}}</span>
            <p>{{postTime}}</p>
        </div>
        <div class="comment-text" disabled>{{comment.text}}</div>
    </div>
</template>

<script>
    import {dateController} from '../../services/date-transformations'

    export default {
        name: 'CommentCard',
        props: {
            comment: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
              postTime: dateController.toString(new Date(this.comment.postTime))
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
    }

    .top-header {
        @include centerRowData(space-between);
        font-size: 0.8em;
    }

    .comment-text {
        width: 100%;
        word-wrap: break-word;
        font-family: inherit;
        font-size: 0.8em;
    }

</style>