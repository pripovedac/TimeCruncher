<template>
    <button class="primary-button" @click="click($event)"
            type="button" :disabled="disabled">
        <slot></slot>
    </button>
</template>

<script>
    export default {
        props: {
            disabled: {
                type: Boolean,
            },
        },
        methods: {
            click(event) {
                this.$emit('click', event)
            },
        },
    }
</script>

<style scoped lang="scss">
    $lightblue: #80d0c7;
    $darkblue: #13547a;

    .primary-button {
        border: none;
        border-radius: 4px;
        color: white;
        font-size: 0.92em;
        text-transform: uppercase;
        padding: 1em;
        letter-spacing: 1px;
        font-weight: bold;
        font-family: inherit;
        background: linear-gradient($lightblue, $darkblue);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        cursor: pointer;
        outline: none;
    }

    button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
