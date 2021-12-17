const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express();
app
.use(cors())
.use(helmet())
.use(express.urlencoded({extended: true}))
    .use(express.json({ type: 'application/json' }))
const server = require('http').createServer(app);
require('./services')
const io = require('socket.io')(server, { cors: true });

const hash = new Map

hash.set('7', {
    "password": "010110",
    "title": "测试房",
    "user": "admin",
    "viewer": 10,
    "banner": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181226%2Ffab5d53db33e451aa77bd0e2b29eb1fa.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633623474&t=95f0190c1c24be3e3a2e6c1e809d2b61"
})

app.get('/', (req, res) => {
    res.send('hello rtc')
})

app.get('/count', (req, res) => {
    res.json({
        code: 200,
        data: hash.size
    })
})

app.get('/list', (req, res) => {
    res.json({
        code: 200,
        data: [...hash.values()]
    })
})

io.on('connection', (socket) => { 
    
    socket.on('create', (config) => {
        const {uid} = config
        socket.join(uid)
        hash.set(uid, config)
        socket.emit('create-success', '创建成功回调')
    })    

    socket.on('join', async (data) => {
        const {uid} = data
        const room = hash.get(uid)
        if(!room) return socket.emit('join-error', '房间不存在')
        const {viewer} = room
        const users = await io.in(room).allSockets()
        const roomCount = users.size
        if (roomCount >= viewer) return socket.emit('join-error', '房间满员')
        socket.join(uid)
        socket.emit('join-success', '加入成功回调')
    })

    socket.on('leave', (data) => {
        const {uid} = data
        socket
            .leave(uid)
        socket
            .emit('message', '离开房间')
    })

    socket.on('close', (config) => {
        const {uid} = config
        if(!hash.has(uid)) return
        socket.to(uid).emit('close')
    })

    socket.on('disconnecting', () => {
        console.log(socket.rooms); // the Set contains at least the socket ID
    });


    socket.on('disconnect', () => {
        socket.emit('disconnect-success', '断开成功回调')
    })
 });

const PORT = process.env.PORT || 3333

server.listen(PORT, () => {
    console.log(`server work ${PORT}`)
});