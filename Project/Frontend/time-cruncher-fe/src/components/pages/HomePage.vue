<template>
    <div class="home-page">
        <Sidebar :groups="groups"/>
        <router-view/>
        <!--<MainPage :tasks="tasks" groupName="Nabavka"/>-->
    </div>
</template>

<script>
    import Sidebar from '../ui/Sidebar'
    import * as global from '../../services/utilites'
    import {IronMan} from '../../Hero'

    export default {
        name: 'HomePage',
        components: {
            Sidebar,
        },
        data() {
            return {
                groups: [],
                tasks: [],
                userId: this.getUserId()
            }
        },
        methods: {
            initGroups: async function () {
                // this.groups = this.loadGroups()
                //if (!this.groups) {
                this.groups = await this.fetchGroups()
                //}
            },

            fetchGroups: async function () {
                // todo: here should be fetched only groups for current member, not all of them
                console.log('Fetching groups...')
                const response = await fetch(process.env.VUE_APP_BE_URL + `/users/${this.userId}/groups`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                let groups = {}
                if (response.ok) {
                    groups = await response.json()
                    global.groupState.save(groups)
                }

                return groups


            },

            loadGroups: function () {
                return global.groupState.load()
            },

            getUserId: function () {
                return global.userState.load()
            }
        },

        created() {
            //IronMan.getDetails()
            this.initGroups()
        }
    }
</script>

<style scoped>

    .home-page {
        display: flex;
    }

    .sidebar {
        width: 15%;
        position: sticky;
        top: 0;
        left: 0;
    }

    .main-page {
        width: 100%;
    }

</style>