<template>
    <div class="comment-card">
        <div>
            <span>{{comment.user.firstname}} {{comment.user.lastname}}</span>
            <p>{{postTime}}</p>
        </div>
        <textarea :value="comment.text"></textarea>
    </div>
</template>

<script>
    import {dateController} from '../../services/date-transformations'

    export default {
        name: 'CommentCard',
        prop: {
            comment: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
              postTime: dateController.toString(this.comment.postTime)
            }
        }
    }
</script>

<style scoped>

</style>