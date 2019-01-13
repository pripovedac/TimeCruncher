<template>
    <label class="public-input">
        <span>{{label}}</span>
        <input :type="type"
               :value="value"
               @input="onInput($event)"
        />
    </label>
</template>

<script>
    export default {
        name: "PublicInput",
        model: {
            prop: 'value',
            event: 'input'
        },
        props: {
            value: {
                type: String
            },
            label: {
                type: String
            },
            type: {
                type: String
            },
        },
        methods: {
            onInput(event) {
                this.$emit('input', event.target.value)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    label {
        @extend %flexColumn;

        width: 100%;
        padding-bottom: 0.2em;
        justify-content: flex-start;
        align-items: flex-start;
        border-bottom: 1px solid #eee;
        font-family: 'Montserrat', 'sans-serif';
        font-size: inherit;
    }

    span {
        margin-bottom: 0.5em;
        font-size: inherit;
    }

    input {
        @include removeDefault(border, outline);

        width: 100%;
        font-family: inherit;
        font-size: inherit;
    }


</style>
