var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var myo_client = io.of('/myo');
var android_client = io.of('/android');

myo_client.on('connection', function (myo_socket) {
  myo_socket.on('message', function (data) {
    android_client.emit('sneddata', data);
    console.log(data);
  });
});

android_client.on('connection', function (android_socket) {
  android_socket.on('echo', function(data) {
    console.log(data);
  });
});
