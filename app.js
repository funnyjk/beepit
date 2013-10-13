var 
	express = require('express'),
	app = express(),
	server = require('http').createServer(app), 
	io = require('socket.io').listen(5000)
;

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
  	data["message"] = "SERVER: " + data["message"];
  	socket.emit('message', data);
  });
});

app.listen(3000);