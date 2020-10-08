const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const socketIo = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const env = require('./src/helpers/env')
const user = require('./src/routes/users')
const path = require('path')
const ejs = require('ejs')


const userModel = require('./src/models/user')

app.use(cors())

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/user', user)
io.on('connection', (socket) => {
    console.log('user online')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
    socket.on('get-user', () => {
        userModel.getall()
            .then((result) => {
                io.emit('list-user', result)
            })
    })
    socket.on('join-room', (payload) => {
        socket.join(payload.user)
    })
    socket.on('send-message', (data) => {
        userModel.insertChat(data)
        userModel.gethistoryChat(data)
            .then((result) => {
                io.to(data.sender).emit('list-message', result)
                io.to(data.receiver).emit('list-message', result)
            })
    })
    socket.on('open-chat', (data) => {
        userModel.gethistoryChat(data)
            .then((result) => {
                io.to(data.sender).emit('list-message', result)
            })
    })
    socket.on('add-friend', (data) => {
        userModel.addFriend(data)
        userModel.getFriend(data)
            .then((result) => {
                io.emit('list-friend', result)
            })
    })
    socket.on('get-friend', (data) => {
        userModel.getFriend(data)
            .then((result) => {
                io.emit('list-friend', result)
            })
    })
})


server.listen(env.port, () => {
    console.log('server running in port 3003')
})
