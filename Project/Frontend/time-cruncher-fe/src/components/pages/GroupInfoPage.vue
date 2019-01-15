<template>
    <div class="task-info">
        <form @submit.prevent="updateTask($event)">
            <h1>
                <input aria-label="title" placeholder="Task name"
                       v-model="group.name"
                       spellcheck="false"/>
            </h1>

            <h2>
                <AlignLeftIcon class="icon"/>
                Description
            </h2>
            <textarea placeholder="Description"
                      v-model="group.description"
                      rows="8"
                      spellcheck="false"
            />

            <div class="members">
                <h2>
                    <UsersIcon class="icon"/>
                    Members
                </h2>
                <div class="textarea-container">
                    <textarea v-model="memberEmails"
                              rows="3"
                              spellcheck="false"
                              type="text"
                    />
                    <p>Please separate multiple addresses with single space.</p>
                </div>
                <div class="member-list">
                    <MemberCard v-for="member in members"
                                :key="member.id"
                                :firstname="member.firstname"
                                :lastname="member.lastname"
                                :id="member.id"
                                @click="removeMember($event)">
                    </MemberCard>
                </div>
            </div>

            <div class="danger-zone">
                <h2>
                    <Trash2Icon class="icon"/>
                    Danger zone
                </h2>
                <div class="delete-container">
                    <p>Delete this group</p>
                    <DeleteButton @click="deleteGroup($event)">
                        Delete
                    </DeleteButton>
                </div>
            </div>

            <button type="submit">Update</button>
        </form>
    </div>
</template>

<script>
    import DeleteButton from '../ui/DeleteButton'
    import MemberCard from '../ui/MemberCard'
    import {AlignLeftIcon, UsersIcon, Trash2Icon} from 'vue-feather-icons'
    import router from '../../routes/routes'
    import * as global from '../../services/utilites'
    import * as groupsApi from '../../services/api/groups'
    import * as removeGroup$ from '../../event-buses/remove-group'

    export default {
        name: 'GroupInfoPage',
        components: {
            DeleteButton,
            MemberCard,
            AlignLeftIcon,
            UsersIcon,
            Trash2Icon,
        },
        data() {
            return {
                group: this.loadLastActiveGroup(),
                members: [],
                memberEmails: '',
            }
        },
        methods: {
            updateTask() {

            },

            initMembers: async function () {
                const groupId = this.$route.params.groupId
                const response = await groupsApi.getMembers(groupId)

                if (!response.errorStatus) {
                    this.members = response
                } else {
                    alert('Problem with fetch members.')
                }
            },

            deleteGroup: async function () {
                const shouldDelete = confirm(`Are you sure you want to delete group ${this.group.name}?`)
                if (shouldDelete) {
                    const response = await groupsApi.deleteSingle(this.group.id)

                    if (!response.errorStatus) {
                        const group = this.getFirstGroup()
                        if (group) {
                            this.saveLastActiveGroup(group)
                            router.push({name: 'GroupInfo', params: {groupId: group.id}})
                            removeGroup$.publish(this.group.id)
                        }
                    } else {
                        alert('Problem with fetch members.')
                    }
                }
            },

            separateMails: function (mails) {
                return mails.split(' ')
            },

            removeMember: function (member) {
                this.members = this.members.filter(m => m.id != member.id)
            },

            saveLastActiveGroup: function (group) {
                global.groupState.saveLastActiveGroup(group)
            },

            loadLastActiveGroup: function () {
                return global.groupState.loadLastActiveGroup()
            },

            getFirstGroup: function () {
                return global.groupState.getFirst()
            }
        },
        watch: {
            $route() {
                this.group = this.loadLastActiveGroup()
                this.initMembers()
            }
        },
        created() {
            this.initMembers()
        }
    }
</script>

<style scoped lang="scss">
    @import '../styles/main.scss';

    .task-info {
        @extend %flexColumn;
        height: 100vh;
        padding-left: 1em;
        padding-right: 1em;
        background-color: #fff;
        border-left: 2px solid #eee;
    }

    form {
        @extend %flexColumn;
        background-color: #fff;

    }

    input, textarea {
        @include remove(border, outline);
        width: 100%;
        font-family: inherit;
    }

    h1 {
        font-size: 1.4em;
        font-weight: bold;
    }

    .label-container {
        @include centerRowData();
        font-size: 1em;
    }

    input[type="date"] {
        @include remove(border, outline);
        width: 40%;
        font-family: inherit;
    }

    input {
        font-size: 1.5em;
        font-weight: bold;
    }

    .date-container {
        font-size: 0.8em;
    }

    p {
        margin-top: 0;
        font-size: inherit;
    }

    // Due date container
    p + label {
        display: flex;
        justify-content: flex-start;
        width: 100%;
        font-size: inherit;

        // Due date value
        > input {
            width: 70%;
            margin-left: 0.5em;
            font-size: inherit;
            font-weight: normal;
            font-size: 1em;
        }
    }

    textarea {
        resize: none;
    }

    .members {
        @extend %flexColumn;
    }

    .textarea-container {
        textarea {
            border: 1px solid #eee;
        }

        p {
            color: darkgray;
            font-size: 0.7em;
        }
    }

    .member-list {
        display: flex;
        flex-wrap: wrap;
    }

    .member-card {
        width: 35%;
        display: flex;
        align-items: center;
        margin-bottom: 0.5em;
        margin-right: 0.5em;
        border: 1px solid $lightblue;
        font-size: 0.7em;
    }

    // remove member button
    button {
        @include remove(border, outline);
        display: flex;
        align-items: center;
        background-color: white;
    }

    h2 {
        display: flex;
        align-items: center;
        margin-top: 0.5em;
        font-size: 1.2em;
    }

    .label-checkbox {
        display: flex;
        margin-top: 1em;
        justify-content: center;
        align-self: flex-start;
    }

    .checkbox {
        margin-right: 0.8em;
    }

    .danger-zone button {
        border: 1px solid blue;
    }

    .delete-container {
        @include centerRowData(space-between);
        margin-bottom: 1em;

        p {
            margin-bottom: 0;
        }

        .delete-button {
            width: 25%;
            border: 1px solid $darkred;
            font-size: 0.8em;
        }
    }

    .icon {
        padding-right: 0.5em;
        width: 1em;
    }

    button[type="submit"] {
        display: block;
        width: 30%;
        margin-top: 1em;
        padding: 1em;
        align-self: center;
        font-family: inherit;
        font-weight: bold;
        font-size: 0.92em;
        letter-spacing: 1px;
        text-align: center;
        text-transform: uppercase;
        color: white;
        border: none;
        outline: none;
        background: linear-gradient($lightblue, $darkblue);
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }

    form + p {
        width: 100%;
        margin-top: 2em;
        text-align: center;

        a {
            color: $darkblue;
            text-decoration: none;
        }
    }

    textarea {
        border: 1px solid #eee;
    }

</style>