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


io.sockets.on('connection', function (socket) {
  socket.emit('message', {"message" : "-- hi --"});
  socket.on('message', function (data) {
  	data["message"] = "SERVER: " + data["message"];
  	socket.emit('message', data);
  });
  socket.on('action', function (data) {
  	if (data.action_id == "3") {
  		socket.emit('response', {
  			"pass" : "true",
  			"device_id" : data.device_id
  		});
  	} else {
  		socket.emit('response', {
  			"pass" : "false",
  			"device_id" : data.device_id
  		});
  	}
  })
});

var port = 3000;
app.listen(port, function() {
	console.log("Listening on " + port);
});