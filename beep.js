var 
	express = require('express'),
	app = express(),
	server = require('http').createServer(app)
	io = require('socket.io').listen(5000), 
	mongoose = require('mongoose'),
	db = mongoose.Schema,
	bopSchema  = new db ({
		gameID: Number,
		actnum: Number,
		time: Number,
		timeInt: Number,
		action: String
	});
	game = mongoose.model('game', bopSchema);

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/assets'));
});

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});
