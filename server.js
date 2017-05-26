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
    
    io.emit('clientConnected', socket.id + " connected on port: " + PORT)
    
    socket.on('message', (text) => {
        io.emit('messageReceived', text)
    });
    
    socket.on('getSendToOthers', (text) => {
        socket.broadcast.emit('setSendToOthers', text)
    });
    
    socket.on('getLocationMoments', (payload) => {
        request({
            url: API_BASEURL + '/moments/location/',
            method: 'GET',
            data: payload,
            json: true
        }, function(err, res, body) {
            socket.emit('setLocationMoments', body)
        });
    });
    
    socket.on('getMapMarkers', (payload) => {
        request({
            url: API_BASEURL + '/locations/filter/',
            method: 'GET',
            data: payload,
            json: true
        }, function(err, res, body) {
            socket.emit('setMapMarkers', body)
        });
    });
    
    socket.on('submitNewMoment', (payload) => {
        request({
            url: API_BASEURL + '/moments/',
            method: 'POST',
            data: payload,
            json: true
        }, function(err, res, body) {
            io.emit('suggestGetMapMarkers')
        });
    });
    
});
