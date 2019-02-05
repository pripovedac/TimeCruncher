import Pusher from 'pusher-js'

export class SingletonPusher {
    static Instance() {
        if (!this.pusher) {
            this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
                cluster: process.env.VUE_APP_PUSHER_CLUSTER,
                authEndpoint: process.env.VUE_APP_BE_URL + '/pusher/auth',
                auth: {
                    headers: {
                        'access_token': localStorage.getItem('user') ? localStorage.getItem('user').accessToken : null
                    }
                }
            });
        }
        return this.pusher
    }
}