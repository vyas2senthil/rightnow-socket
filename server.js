'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const request = require('ajax-request');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const API_BASEURL = "https://rightnow.000webhostapp.com";

const server = express()
    .use((req, res) => res.sendFile(INDEX) )
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
    
    console.log(socket)
    
    io.emit('clientConnected', "Client with SOCKET ID: " + socket.id + " connected on port: " + PORT + " and index: " + INDEX)
    
    socket.on('message', (text) => {
        io.emit('messageReceived', text)
    });
    
    socket.on('get_location_moments', (payload) => {
        request({
            url: API_BASEURL + '/moments/location/',
            method: 'GET',
            data: payload,
            json: true
        }, function(err, res, body) {
            console.log(socket.id)
            io.to(socket.id).emit('set_location_moments', body)
        });
    });
    
    socket.on('getMapMarkers', (payload) => {
        request({
            url: API_BASEURL + '/locations/filter/',
            method: 'GET',
            data: payload,
            json: true
        }, function(err, res, body) {
            io.to(socket.id).emit('setMapMarkers', body)
        });
    });
    
    socket.on('disconnect', () => {
        io.emit('clientDisconnected', "Client disconnected")
    });
    
});
