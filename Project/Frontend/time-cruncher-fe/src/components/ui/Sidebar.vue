<template>
    <div class="sidebar">
        <h1>
            <UserIcon class="icon"/>
            <span>darecare</span>
        </h1>
        <div class="group-container">
            <h2>Groups</h2>
            <!--todo: everything here should be a router-link-->
            <PlusCircleIcon class="plus-icon"/>
        </div>
        <div class="filter-container">
            <h3>Filters</h3>
            <span>Daily</span>
            <span>Weekly</span>
            <span>Uncategorized</span>
        </div>
    </div>
</template>

<script>
    import {UserIcon, HashIcon, LockIcon, PlusCircleIcon} from 'vue-feather-icons'

    export default {
        name: "Sidebar",
        components: {
            UserIcon,
            HashIcon,
            LockIcon,
            PlusCircleIcon
        },
        props: {
            groups: {
                type: Array
            },
        }
    }
</script>

<style scoped lang="scss">
    $darkblue: #191970;

    .sidebar {
        display: flex;
        flex-direction: column;
        width: 16%;
        height: 100vh;
        margin: 0;
        padding-left: 1em;
        padding-right: 1em;
        color: #fff;
        // todo: position in the parent element
        position: relative;
        top: 0;
        left: 0;

        border-right: 1px solid black;
    }

    h1 {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.8em;
        /*border: 1px solid black;*/
    }

    h2, h3 {
        font-size: 1em;
        margin-bottom: 0.5em;
    }

    .group-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }


    .filter-container {
        display: flex;
        flex-direction: column;

        span {
            /*border: 1px solid black;*/
            padding-left: 0.5em;
            padding-bottom: 0.5em;
            font-size: 0.8em;
        }
    }



    .icon {
        width: 1em;
        margin-right: 0.6em;
    }

    .plus-icon {
        width: 1.2em;
    }

</style>