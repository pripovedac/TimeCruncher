<template>
    <span class="member-card">
        {{firstname}} {{lastname}}
        <button @click="onClick($event)" type="button">
            <XIcon class="icon"/>
        </button>
    </span>
</template>

<script>
    import {XIcon} from 'vue-feather-icons'

    export default {
        name: 'MemberCard',
        components: {
            XIcon
        },
        props: {
            firstname: {
                type: String,
            },
            lastname: {
                type: String
            },
            id: {
                type: Number,
            },
            email: {
                type: String,
            }
        },
        methods: {
            onClick() {
                const member = {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email,
                    id: this.id
                }
                this.$emit('click', member)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .member-card {
        @include centerRowData(space-between);

        width: 100%;
        padding-left: 0.2em;
        padding-right: 0.2em;
        color: black;
        font-size: inherit;
        border-radius: 4px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
    }

    button {
        padding: 0;
        border-radius: 50%;
        border: none;
        color: $lightblue;
        font-size: 0.5em;
        background-color: inherit;
    }

    .icon {
        width: 2em;
        cursor: pointer;
    }


</style>