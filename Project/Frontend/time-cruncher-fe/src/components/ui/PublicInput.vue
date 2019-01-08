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

<style scoped>
    label {
        width: 100%;
        padding-bottom: 0.2em;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        /*border: 1px solid red;*/
        border-bottom: 1px solid #eee;
        font-family: 'Montserrat', 'sans-serif';
        font-size: inherit;
    }
    span {
        margin-bottom: 0.5em;
        font-size: inherit;
    }
    input {
        width: 100%;
        /*border: 1px solid blue;*/
        border: none;
        outline: none;
        font-family: inherit;
        font-size: inherit;
    }


</style>
