import { io } from 'socket.io-client'
// const serverUrl = 'http://localhost:8080'
const serverUrl = 'https://wells-shop.herokuapp.com'
const socket = io(serverUrl)
export default socket