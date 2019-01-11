<template>
    <button class="load-button"
            type="button"
            @click="click($event)"
            :disabled="disabled">
        <slot></slot>
    </button>
</template>

<script>
    export default {
        name: 'LoadButton'
    }
</script>

<style scoped lang="scss">
    $lightblue: #80d0c7;

    button {
        width: 100%;
        padding: 0.5em;
        background: white;
        border: 1px solid $lightblue;
        border-radius: 4px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: bold;
        font-family: inherit;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        cursor: pointer;
        outline: none;
    }

    button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>