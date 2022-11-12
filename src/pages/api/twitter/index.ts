import { auth, Client } from 'twitter-api-sdk'
import { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from '../configs'

const authClient = new auth.OAuth2User({
  client_id: TWITTER_CLIENT_ID,
  client_secret: TWITTER_CLIENT_SECRET,
  callback: 'http://localhost:3000/callback',
  scopes: ['tweet.read', 'users.read'],
})
const client = new Client(authClient)

const authUrl = authClient.generateAuthURL({
  code_challenge_method: 's256',
  state: '',
})
