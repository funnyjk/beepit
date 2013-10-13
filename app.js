var 
	express = require('express'),
	app = express(),
	server = require('http').createServer(app)
	io = require('socket.io').listen(5000); 
	
	NUM_ACTIONS = 3,
	INITIAL_WAIT_TIME = 5000,
	DECREMENT_WAIT_TIME = 50,
	MINIMUM_WAIT_TIME = 500,
	MAX_ROUNDS = 100,
	LAG_THRESHOLD = 4000,
	CURR_ROUND = 0;
	CURR_WAIT = INITIAL_WAIT_TIME;
	
	END_GAME = true,
	GAME_HOST = '',
	CURR_MOVE = -1,
	MOVE_TIMESTAMP = '',
	NUM_PLAYERS = 0,
	ACTIVE_PLAYERS = []
	ACTIVE_PLAYERS_MOVE = []
;

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/assets'));
});

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

app.get('/game', function(req, res){
  	res.sendfile(__dirname + '/game.html');
});

io.sockets.on('connection', function (socket) {
	//## PLAYER FUNCTIONALITY
	socket.on('join_game', function (data) {
		console.log("try to join...")
		if (END_GAME == true && GAME_HOST != '') {
			socket.join('game');
			ACTIVE_PLAYERS.push(socket);
			updatePlayerCount(1);
			console.log("succeed!");
		}
	});
	//can player continue or not
	socket.on('action', function (data) {
		console.log("got action!");
		var pass = "false"
		var in_time = (data["time_stamp"] - MOVE_TIMESTAMP) < LAG_THRESHOLD;
		var correct_move = (CURR_MOVE == data["action_id"]);
		var index = ACTIVE_PLAYERS.indexOf(socket);
		console.log("comparing "+data["action_id"]+" and "+CURR_MOVE)
		console.log(correct_move);
		console.log("comparing "+data["time_stamp"]+" and "+MOVE_TIMESTAMP)
		console.log(in_time);
		if (in_time && correct_move) {
			console.log("made it!");
			pass = "true"
			ACTIVE_PLAYERS_MOVE[index] = true;
		}
		socket.emit('response', {
			"pass" : "false",
			"device_id" : data.device_id
		});
		if (pass == "false") {
			socket.disconnect();
			socket.leave('game');
			if (index > -1) {
			    delete ACTIVE_PLAYERS[index];
			    delete ACTIVE_PLAYERS_MOVE[index];
			}
		}
	});


	//## HOST FUNCTIONALITY
	socket.on('create_game', function (data) {
		GAME_HOST = socket;
		END_GAME = true;
	});
	socket.on('start_game', function (data) {
		console.log("try to start game...");
		if (GAME_HOST == socket) {
			console.log("yesssss");
			END_GAME = false;
			io.sockets.in('game').emit('message', {'message' : 'Game is about to begin!'});
			CURR_MOVE = randAction();
			MOVE_TIMESTAMP = new Date().getTime();
			if(CURR_WAIT > MINIMUM_WAIT_TIME) {
				CURR_WAIT -= DECREMENT_WAIT_TIME;
			}
			console.log(CURR_MOVE);
			setTimeout(intervalLoop, CURR_WAIT);
			for (var i=0; i<ACTIVE_PLAYERS.length; i++) {
				ACTIVE_PLAYERS[i] = false;
			}
		}
	});
	socket.on('disconnect', function () {
		if (socket == GAME_HOST) {
			END_GAME = true;
			GAME_HOST = '';
			CURR_MOVE = -1;
			MOVE_TIMESTAMP = '';
			NUM_PLAYERS = 0;
			io.sockets.in('game').emit('message', {'message' : 'ERROR: host disconnected'})
		} else {
			//updatePlayerCount(-1);
		}
		console.log("disconnect!");
	});
	socket.on('declare_winner', function () {
		if (socket == GAME_HOST) {
			//broadcast to all clients that the game is over, possibly disply winners name
			io.sockets.in('game').emit('message', {'message' : 'Game is over!'});
			END_GAME = true;
		}
	});
});



var port = 3000;
app.listen(port, function() {
	console.log("Listening on " + port);
});


//------
function randAction() {
	return Math.floor(Math.random() * NUM_ACTIONS) + 1;;
}
var gameLoop = function() {
	//-- to handle players who just dont respond
	console.log(ACTIVE_PLAYERS.length);
	if (CURR_MOVE != -1) {
		for (var i=0; i<ACTIVE_PLAYERS.length; i++) {
			if (ACTIVE_PLAYERS[i] && !ACTIVE_PLAYERS_MOVE[i]) {
				var socket = ACTIVE_PLAYERS[i];
				socket.disconnect();
				delete ACTIVE_PLAYERS[i];
			}
		}
		var temp = [];
		ACTIVE_PLAYERS_MOVE = [];
		for (var i=0; i<ACTIVE_PLAYERS.length; i++) {
			if (ACTIVE_PLAYERS[i]) {
				temp.push(ACTIVE_PLAYERS[i]);
				ACTIVE_PLAYERS_MOVE.push(false);
			}
		}
		ACTIVE_PLAYERS = temp;
		if (ACTIVE_PLAYERS.length < 1) {
			END_GAME = true;
			io.sockets.in('game').emit('message', {'message' : 'Game is over!'});
		}
	}
	console.log(ACTIVE_PLAYERS.length);
	//-- end ---

	CURR_MOVE = randAction();
	MOVE_TIMESTAMP = new Date().getTime();
	if(CURR_WAIT > MINIMUM_WAIT_TIME) {
		CURR_WAIT -= DECREMENT_WAIT_TIME;
	}
	console.log(CURR_MOVE);
}
var intervalLoop = function(curr) {
	console.log("interval loop");
	CURR_ROUND++;
	if (END_GAME || CURR_ROUND > MAX_ROUNDS) return;
	console.log("passed condition");
	gameLoop();
	setTimeout(intervalLoop, CURR_WAIT);
}
var updatePlayerCount = function(delta) {
	console.log("try update count");
	NUM_PLAYERS+=delta;
	if (NUM_PLAYERS < 0) NUM_PLAYERS = 0
	var data = {};
	data["num_players"] = NUM_PLAYERS;
	if (END_GAME) data["game_status"] = "not_started";
	else data["game_status"] = "in_progresss";
	if (GAME_HOST) GAME_HOST.emit("num_players", {"num_players" : NUM_PLAYERS});
}