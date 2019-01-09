<template>
    <span class="member-card">
        {{name}}
        <button @click="onClick($event)">
            <XIcon class="icon" />
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
          name: {
              type: String,
          },
          id: {
              type: Number,
          }
        },
        methods: {
            onClick(event) {
                const member = {
                    name: this.name,
                    id: this.id
                }
                this.$emit('click', member)
            }
        }
    }
</script>

<style scoped lang="scss">
    $lightblue: #80d0c7;
    $darkblue: #13547a;

    .member-card {
        /*border: 1px solid white;*/
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
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