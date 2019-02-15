<template>
    <div class="sidebar">
        <!--todo: everything here should be a router-link-->
        <div class="top-container">
            <h1>
                <UserIcon class="icon"/>
                <span>{{user.firstname}} {{user.lastname}}</span>
            </h1>
        </div>
        <div class="user-actions">
            <button @click="logout($event)">
                <LogOutIcon class="icon"/>
                Logout
            </button>
            <router-link :to="{name: 'ModifyUser'}">
                <BookOpenIcon class="icon"/>
                User details
            </router-link>
        </div>

        <div class="group-header">
            <div>
                <h2>Groups</h2>
                <button v-if="newGroup" @click="mergeGroups($event)">
                    <BellIcon class="icon"/>
                </button>
            </div>
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
            <router-link :to="{name: 'DailyInfo'}">
                <CalendarIcon class="icon"/>
                Daily
            </router-link>
            <router-link :to="{name: 'Weekly', query: {offset: 0}}">
                <CalendarIcon class="icon"/>
                Weekly
            </router-link>
            <router-link :to="{name: 'UncategorizedInfo'}">
                <CalendarIcon class="icon"/>
                Uncategorized
            </router-link>
        </div>
    </div>
</template>

<script>
    import {
        UserIcon,
        HashIcon,
        LockIcon,
        PlusCircleIcon,
        BellIcon,
        LogOutIcon,
        CalendarIcon,
        BookOpenIcon,
    } from 'vue-feather-icons'

    export default {
        name: "Sidebar",
        components: {
            UserIcon,
            HashIcon,
            LockIcon,
            PlusCircleIcon,
            BellIcon,
            LogOutIcon,
            CalendarIcon,
            BookOpenIcon,
        },
        props: {
            groups: {
                type: Array,
            },
            newGroup: {
                type: Boolean,
            },
            user: {
                type: Object
            },
            shouldReload: {
                type: Boolean,
            }
        },
        methods: {
            mergeGroups: function () {
                this.$emit('mergeGroups')
            },

            logout: function () {
                this.$emit('logout')
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .sidebar {
        @extend %flexColumn;
        width: 100%;
        height: 100vh;
        margin: 0;
        padding-left: 1em;
        padding-right: 1em;
        color: #fff;
        background: linear-gradient($lightblue, $darkblue);
        border-right: 1px solid black;
    }

    .top-container {
        @include centerRowData(space-between);
        width: 100%;
    }

    h1 {
        @include centerRowData();
        font-size: 0.8em;
        margin-bottom: 0em;
    }

    // Logout and user details
    .user-actions {
        button, a {
            @include centerRowData();
            @include remove(border, background);
            padding: 0;
            padding-left: 0.5em;
            color: white;
            cursor: pointer;
            font-family: inherit;
            font-size: 0.8em;
        }
    }

    h1 > .icon {
        width: 1.3em;
    }

    h2, h3 {
        font-size: 1em;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }

    .group-header {
        @include centerRowData(space-between);

        div {
            display: flex;
            padding-top: 0.3em;
            align-items: center;
        }

        h2 {
            // todo: complete disaster - change this
            margin-top: 0.1em;
        }

        button {
            @include remove(background, border, outline);
            margin: 0;
            padding: 0;
            margin-left: 0.5em;
            color: white;
            align-items: center;
            cursor: pointer;
        }

        a {
            margin-top: 0.5em;
        }

        .icon {
            margin-top: 0;
            padding-right: 0;
        }

    }

    a {
        @include remove(outline, text-decoration);
        @include centerRowData('center');
        color: white;
    }

    .filter-container, .group-container {
        @extend %flexColumn;

        a {
            padding-left: 0.5em;
            padding-bottom: 0.5em;
            font-size: 0.8em;
        }
    }

    // single group name container
    // e.g. <lock-icon> nabavka [<bell-icon>]
    .group-container > a {
        @include centerRowData();

        div {
            width: 100%;
            @include centerRowData(space-between);
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