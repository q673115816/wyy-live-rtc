const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express();
app
    .use(cors())
    .use(helmet())
    .use(express.urlencoded({ extended: true }))
    .use(express.json({ type: 'application/json' }))
const server = require('http').createServer(app);
const { liveSchema, liveModel } = require('./services')
const io = require('socket.io')(server, { cors: true });

app.get('/', (req, res) => {
    res.send('hello rtc')
})

app.get('/count', async (req, res) => {
    const data = await liveModel.count({})
    res.json({
        code: 200,
        data
    })
})

app.get('/list', async (req, res) => {
    const data = await liveModel.find({}, { _id: false, __v: false })
    console.log(data)
    res.json({
        code: 200,
        data
    })
})

io.on('connection', (socket) => {

    socket.on('create', async (config) => {
        const { uid } = config
        socket.join(uid)
        const newLiveModel = new liveModel(config)
        await newLiveModel.save()
        socket.emit('create-success', '创建成功回调')
    })

    socket.on('join', async (data) => {
        const { uid } = data
        const room = await liveModel.findOne({ uid })
        if (!room) return socket.emit('join-error', '房间不存在')
        const { viewer } = room
        const users = await io.in(room).allSockets()
        const roomCount = users.size
        if (roomCount >= viewer) return socket.emit('join-error', '房间满员')
        socket.join(uid)
        socket.emit('join-success', '加入成功回调')
    })

    socket.on('leave', (data) => {
        const { uid } = data
        socket
            .leave(uid)
        socket
            .emit('message', '离开房间')
    })

    socket.on('close', async (config) => {
        const { uid } = config
        await liveModel.findOneAndDelete({ uid })
        // if (!room) return
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