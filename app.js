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
    res.json({
        code: 200,
        data
    })
})

io.on('connection', (socket) => {
    console.log('socket.id', socket.id)
    // console.log('socket.handshake', socket.handshake)

    socket.on('create', async (data) => {
        const { detail, description, iceCandidate } = data
        const { uid } = detail
        socket.join(uid)
        // const newLiveModel = new liveModel(data)
        try {
            await liveModel
                .updateOne({ uid }, { ...data.detail, id: socket.id }, { upsert: true })
            socket.emit('create-success', '创建成功回调')
            socket.broadcast.to(uid).emit('create-success', '房主开播')
            socket.broadcast.to(uid).emit('publish', { detail: { id: socket.id }, description, iceCandidate })
        } catch (error) {
            console.log('create-error', error);
            socket.emit('create-error', '创建失败')
        }
    })

    socket.on('join', async (data) => {
        const { detail } = data
        const { uid } = detail
        // console.log('join ids', await io.allSockets())
        // console.log('join io.sockets.adapter.rooms', io.sockets.adapter.rooms)
        const isActiveRoom = io.sockets.adapter.rooms.has(uid)
        const room = await liveModel.findOne({ uid })
        if (!isActiveRoom) {
            console.log('room', room)
            if (room) {
                await liveModel.findOneAndDelete({ uid }) // 删除该房
            }
            socket.emit('join-success', '加入成功回调-房间未开播')
            return
        }
        if (!room) {
            socket.emit('join-error', '加入失败回调-已开播但查询失败')
            return
        }
        const { viewer } = room
        const users = await io.in(uid).allSockets()
        const roomCount = users.size
        if (roomCount >= viewer) {
            socket.emit('join-error', '加入失败回调-房间满员')
            return
        }
        socket.join(uid)
        socket.emit('join-success', room)
        socket.to(room.id).emit('join-success', { id: socket.id })
    })

    socket.on('publish', async (data) => {
        const { detail, description, iceCandidate } = data
        const { uid } = detail
        socket.broadcast.to(uid).emit('publish', { detail: { id: socket.id }, description, iceCandidate })
    })

    socket.on('private', async (data) => {
        const { to, detail, description, iceCandidate } = data

        socket.to(to).emit('private', data)
    })

    socket.on('leave', (data) => {
        const { detail, description, iceCandidate } = data
        const { uid } = detail
        socket
            .leave(uid)
        socket
            .emit('message', '离开房间')
    })

    socket.on('close', async (data) => {
        const { detail, description, iceCandidate } = data
        const { uid } = detail
        await liveModel.findOneAndDelete({ uid })
        // if (!room) return
        socket.to(uid).emit('close')
    })

    socket.on('disconnecting', () => {
        console.log('disconnecting', socket.rooms); // the Set contains at least the socket ID
    });


    socket.on('disconnect', () => {
        socket.emit('disconnect-success', '断开成功回调')
    })
});

const PORT = process.env.PORT || 3333

server.listen(PORT, () => {
    console.log(`server work ${PORT}`)
});