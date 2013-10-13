var 
	express = require('express'),
	app = express(),
	server = require('http').createServer(app)
	io = require('socket.io').listen(5000);
;

function sendAction(sessionID) {

}

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/assets'));
});

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

var sessions = {};


when the client connects, this runs
io.sockets.on('connection', function (socket) {
  socket.emit('message', {"message" : "-- hi --"});
  socket.on('message', function (data) {
  	data["message"] = "SERVER: " + data["message"];
  	socket.emit('message', data);
  });
});

var port = 3000;
app.listen(port, function() {
	console.log("Listening on " + port);
});