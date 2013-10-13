var 
	express = require('express'),
	app = express(),
	server = require('http').createServer(app), 
	io = require('socket.io').listen(80);
;

function sendAction(sessionID) {

}

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/assets'));
});

app.get('/', function(req, res){
  socket.emit('message', "HELLO"+Math.random().toString(36).substring(7));
  res.sendfile(__dirname + '/index.html');
});

var sessions = {};


//when the client connects, this runs
io.sockets.on('connection', function (socket) {
  socket.emit('message', {"message" : "-- hi --"});
  socket.on('message', function (data) {
  	data["message"] = "SERVER: " + data["message"];
  	socket.emit('message', data);
  });
});

app.listen(3000);