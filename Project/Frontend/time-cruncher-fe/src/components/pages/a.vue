<template>
    <div>
        <PublicInput label="Darko"
                     type="text"

        ></PublicInput>
    </div>
</template>

<script>
    import PublicInput from "../ui/PublicInput";

    export default {
        name: "a",
        components: {PublicInput}
    }
</script>

<style scoped lang="scss">
    div {
        border: 1px solid green;
        background-color: lightgreen;
    }

</style>