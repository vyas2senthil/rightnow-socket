'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const request = require('ajax-request');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX) )
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
    
    io.emit('set_socket_id', socket.id)
    
    io.emit('clientConnected', "Client with SOCKET ID: " + socket.id + " connected on port: " + PORT + " and index: " + INDEX)
    
    socket.on('message', (text) => {
        io.emit('messageReceived', text)
    });
    
    socket.on('get_location_moments', (payload) => {
        request({
            url: 'http://rightnow01.altervista.org/moments/location/',
            method: 'GET',
            data: payload,
            json: true
        }, function(err, res, body) {
            socket.broadcast.to(payload.socket_id).emit('set_location_moments', body)
        });
    });
    
    socket.on('disconnect', () => {
        io.emit('clientDisconnected', "Client disconnected")
    });
    
});
