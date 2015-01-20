var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var Parse = require('parse').Parse;

Parse.initialize("XsKT68vDuhFZqJ79tOO4e8ASXag2YOQB8N7qRGGT", "7s0m1mF3NJdxuBMfZ2hjzV0Z4xLbj1yrrk0fDEaz");

var Game = Parse.Object.extend("Game");
var game = new Game();
game.set("scores", []);
game.save(null, {
  success: function(gameObject) {
    console.log('Generated new Game object with id: ' + gameObject.id);
  },
  error: function(gameObject, error) {
    console.log('Failed to create new Game object, with error code: ' + error.message);
  }
});

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
  android_socket.on('game_ended', function (score) {
    game.add("scores", score);
    game.save();
    // Fetch Game Scores after saving the latest score. 
    var query = new Parse.Query(Game);
    query.get(game.id, {
      success: function(gameObject) {
        // The object was retrieved successfully.
        var scores = gameObject.get("scores").sort(function(a, b) {
          return a - b;
        });
        android_client.emit("game_scores", scores);
      },
      error: function(gameObject, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
        console.log('Failed to retrieve the Game object, with error code: ' + error.message);
      }
    });
  });
});

