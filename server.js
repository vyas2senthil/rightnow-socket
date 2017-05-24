'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX) )
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
    
    io.emit('clientConnected', "Client connected on port: " + PORT + " and index: " + INDEX)
    
    socket.on('message', (text) => {
        io.emit('messageReceived', text)
    });
    
    socket.on('disconnect', () => {
        io.emit('clientDisconnected', "Client disconnected")
    });
    
});

setInterval(() => io.emit('time', new Date().toTimeString()), 10000);
