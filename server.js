'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const request = require('ajax-request');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const GOOGLE_API_KEY = "AIzaSyBCTMTBz9Q3c-xIwSkMuxiaRj3jyx41Bi0";
const FACEBOOK_API_KEY = "102180050321783";

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
            if(body.data.id) {
                io.sockets.in('location' + body.data.id).emit('suggestGetLocation')
                console.log(body.data.id)
            }
        });
    });
    
    socket.on('emitEventInRoom', (payload) => {
        io.sockets.in(payload.room).emit('emittedInRoom', payload.event)
    });
    
    socket.on('getLocation', (payload) => {
        request({
            url: API_BASEURL + '/locations/complex/',
            method: 'GET',
            data: payload,
            json: true
        }, function(err, res, body) {
            socket.emit('setLocation', body)
        });
    });
    
    socket.on('joinRoom', (payload) => {
        socket.join(payload)
        console.log(payload)
    });
    
    socket.on('leaveRoom', (payload) => {
        socket.leave(payload)
        console.log(payload)
    });
    
});
