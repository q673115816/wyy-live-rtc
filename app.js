const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const hash = new Map

io.on('connection', (socket) => { 
    socket.on('create', (config) => {
        const {uid} = config
        socket.join(uid)
        hash.set(uid, config)
        socket.emit('create-success')
    })    

    socket.on('join', (data) => {
        const {uid} = data
        socket.join(uid)
        socket.emit('join-success')
    })

    socket.on('close', (config) => {
        const {uid} = config
        if(!hash.get(uid)) return
        socket.to(uid).emit('close')
    })

    socket.on('disconnection', () => {
        
    })
 });
server.listen(3000);