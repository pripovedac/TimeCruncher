import Pusher = require('pusher');

export const pusher = new Pusher({
  appId: '686985',
  key: 'abda0f1c579260109aba',
  secret: 'dc6445a6e96eec7cbcc9',
  cluster: 'eu',
  encrypted: true,
});