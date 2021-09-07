const app = require('express')();
const server = require('http').createServer(app);

const io = require('socket.io')(server, { cors: true });

const hash = new Map

hash.set(010, {
    password: '010110',
    title: '测试房',
    user: 'admin'
})

app.get('/', (req, res) => {
    res.send('hello rtc')
})

app.get('/count', (req, res) => {
    res.json({
        code: 200,
        data: {
            count: hash.size
        }
    })
})

app.get('/list', (req, res) => {
    res.json({
        code: 200,
        data: {
            list: hash.entries()
        }
    })
})

io.on('connection', (socket) => { 
    
    socket.on('create', (config) => {
        const {uid} = config
        socket.join(uid)
        hash.set(uid, config)
        socket.emit('create-success', '创建成功回调')
    })    

    socket.on('join', (data) => {
        const {uid} = data
        socket.join(uid)
        socket.emit('join-success', '加入成功回调')
    })

    socket.on('close', (config) => {
        const {uid} = config
        if(!hash.get(uid)) return
        socket.to(uid).emit('close')
    })

    socket.on('disconnecting', () => {
        console.log(socket.rooms); // the Set contains at least the socket ID
    });


    socket.on('disconnect', () => {
        socket.emit('disconnect-success', '断开成功回调')
    })
 });
server.listen(3333);

module.exports = server