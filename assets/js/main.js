var socket = io();

var $logs,
    $body;

socket.on('clientConnected', function(response) {
    setupLog('clientConnected',response,true)
});

socket.on('messageReceived', function(response) {
    setupLog('messageReceived',response,true)
});

socket.on('setLocationMoments', function(response) {
    setupLog('setLocationMoments',response,false)
});

socket.on('setSendToOthers', function(response) {
    setupLog('setSendToOthers',response,false)
});

$(function() {
    
    $logs = $('#logs');
    $body = $('body');
    
    sendMessage();
    getLocationMoments();
    sendToOthers();
})

var sendMessage = $.fn.sendMessage = function() {
    var onSendMessage = $body.on('submit', '#sendMessage', function(e) {
        e.preventDefault();
        var val = $('#message').val();
        if(val) {
            socket.emit('message', val);
        }
    })
}

var getLocationMoments = $.fn.getLocationMoments = function() {
    var onGetLocationMoments = $body.on('submit', '#getLocationMoments', function(e) {
        e.preventDefault();
        var val = $('#id_location').val();
        if(val) {
            var body = {id_location: val}
            socket.emit('getLocationMoments', body);
        }
    })
}

var sendToOthers = $.fn.sendToOthers = function() {
    var onSendToOthers = $body.on('submit', '#sendToOthers', function(e) {
        e.preventDefault();
        socket.emit('getSendToOthers', "response");
    })
}

var setupLog = $.fn.setupLog = function(event,response,print) {
    if(print) {
        var log = "<li>" + "<strong>" + event + "</strong>" + ": " + response + "</li>";
        logs.append(log)
    } else {
        console.log(event,response)
    }
}
