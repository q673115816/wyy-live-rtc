const app = require('express')();
const helmet = require('helmet')
const cors = require('cors')
app.use(cors())
app.use(helmet())

const server = require('http').createServer(app);

const io = require('socket.io')(server, { cors: true });

const hash = new Map

hash.set('7', {
    password: '010110',
    title: '测试房',
    user: 'admin',
    banner: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181226%2Ffab5d53db33e451aa77bd0e2b29eb1fa.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633623474&t=95f0190c1c24be3e3a2e6c1e809d2b61'
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
    const data = [...hash.entries()].map(([key, {title, user, banner}]) => [key, {title, user, banner}])
    res.json({
        code: 200,
        data
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

const PORT = process.env.PORT || 3333

server.listen(PORT, () => {
    console.log(`server work ${port}`)
});