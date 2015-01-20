var io = require('socket.io-client');
var myo = require('myo');
var socket = io.connect('http://ml.polk.in:3000/myo');
var myMyo = myo.create();

Myo.on('connected', function(){
    console.log('Myo Connected');
    myMyo.on('gyroscope', function(data){
        if (data.y > 300){
            var message = "shoot";
            socket.emit('message', message);
        }
    });
});
