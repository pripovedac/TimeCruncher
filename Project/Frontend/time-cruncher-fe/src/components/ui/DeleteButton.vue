<template>
    <button class="delete-button"
            type="button"
            @click="onClick($event)">
        <slot></slot>
    </button>
</template>

<script>
    export default {
        name: 'DeleteButton',
        methods: {
            onClick(event) {
                this.$emit('click', event)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .delete-button {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 0.5em;
        background: white;
        border: none;
        border-radius: 4px;
        text-transform: uppercase;
        font-weight: bold;
        font-family: inherit;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        cursor: pointer;
        outline: none;
    }

    .delete-button:hover {
        color: white;
        background-color: $darkred;
    }

</style>