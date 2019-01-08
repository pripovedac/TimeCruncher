<template>
    <span class="checkbox">
        <input type="checkbox"
               checked
               class="visually-hidden"
               @click="changeState($event)"
        />
        <span class="visually-displayed">
            <CheckIcon class="icon"/>
        </span>
    </span>
</template>

<script>
    import {CheckIcon} from 'vue-feather-icons'

    export default {
        components: {
            CheckIcon
        },
        methods: {
          changeState(event) {
              this.$emit('changeState', event.target.checked)
          }
        },
    }
</script>

<style scoped lang="scss">
    .icon {
        width: 1em;
    }

    .visually-hidden {
        position: absolute !important;
        clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
        clip: rect(1px, 1px, 1px, 1px);
        padding: 0 !important;
        border: 0 !important;
        height: 1px !important;
        width: 1px !important;
        overflow: hidden;
    }

    .visually-displayed {
        display: flex;
        justify-content: center;
        width: 1em;
        height: 1em;
        border: solid 1px black;
        align-items: center;
    }

    input:not(:checked) + span {
        svg {
            display: none;
        }
    }
</style>