<template>
    <div class="sidebar">
        <!--todo: everything here should be a router-link-->
        <h1>
            <UserIcon class="icon"/>
            <span>Darko Stevanovic</span>
        </h1>
        <div class="group-header">
            <h2>Groups</h2>
            <router-link :to="{path:'/new-group'}">
                <PlusCircleIcon class="plus-icon"/>
            </router-link>
        </div>
        <div class="group-container">
            <router-link :to="{name: 'GroupInfo', params: {groupId: group.id}}"
                         v-for="group in groups"
                         :key="group.id"
                         @click="onClick($event)">
                <LockIcon v-if="group.isPrivate" class="icon"/>
                <HashIcon v-else class="icon"/>
                <div>
                    {{group.name}}
                    <BellIcon v-if="group.shouldReload" class="icon"/>
                </div>
            </router-link>
        </div>
        <div class="filter-container">
            <h3>Filters</h3>
            <router-link :to="{path: '/login'}">Daily</router-link>
            <router-link :to="{path: '/login'}">Weekly</router-link>
            <router-link :to="{path: '/login'}">Uncategorized</router-link>
        </div>
    </div>
</template>

<script>
    import {UserIcon, HashIcon, LockIcon, PlusCircleIcon, BellIcon} from 'vue-feather-icons'

    export default {
        name: "Sidebar",
        components: {
            UserIcon,
            HashIcon,
            LockIcon,
            PlusCircleIcon,
            BellIcon
        },
        props: {
            groups: {
                type: Array,
            },
            shouldReload: {
                type: Boolean,
            }
        },
    }
</script>

<style scoped lang="scss">
    $lightblue: #80d0c7;
    $darkblue: #13547a;

    .sidebar {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        margin: 0;
        padding-left: 1em;
        padding-right: 1em;
        color: #fff;
        background: linear-gradient($lightblue, $darkblue);
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
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }

    .group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        a {
            margin-top: 0.5em;
        }
    }

    a {
        color: white;
        outline: none;
        text-decoration: none;
    }

    .filter-container, .group-container {
        display: flex;
        flex-direction: column;

        a {
            padding-left: 0.5em;
            padding-bottom: 0.5em;
            font-size: 0.8em;
        }
    }

    // single group name container
    // e.g. <lock-icon> nabavka [<bell-icon>]
    .group-container > a {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        div {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
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