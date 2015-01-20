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

// Myo.on('pose', function(pose_name, edge){
//     console.log('POSE: ', pose_name);
//     var message = "shoot";
//     socket.emit('message', message);
// });

// var myoID;

// ws.on('message', function(message) {
//  json = JSON.parse(message);
//     if (json[0] != "event") {
//         
//      return console.log(message);
//     }
//     var data = json[1];
//     if (data.type == "connected") {
//      myoID = data.myo;
//     }
//     if (data.type != "orientation") {
//         console.log(data)
//     }
// });