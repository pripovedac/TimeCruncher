import {userState} from './utilites'

import Pusher from 'pusher-js'
//
// class PusherFactory {
//
//     constructor() {
//         new Pusher(process.env.VUE_APP_PUSHER_KEY, {
//             cluster: process.env.VUE_APP_PUSHER_CLUSTER,
//             authEndpoint: process.env.VUE_APP_BE_URL + '/pusher/auth',
//             auth: {
//                 headers: {
//                     "access_token": this.accessToken
//                 }
//             }
//         });
//     }
// }
//
// export const pusher = new PusherFactory()

export const pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
    cluster: process.env.VUE_APP_PUSHER_CLUSTER,
    authEndpoint: process.env.VUE_APP_BE_URL + '/pusher/auth',
    auth: {
        headers: {
            'access_token': localStorage.getItem('user') ? localStorage.getItem('user').accessToken : null
        }
    }
});