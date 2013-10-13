var NUM_ACTIONS = 3;
var INITIAL_WAIT_TIME = 3000;
var DECREMENT_WAIT_TIME = 100;
var MINIMUM_WAIT_TIME = 500;

function randAction() {
	var action = Math.floor(Math.random() * NUM_ACTIONS) + 1;
	return action;
}

//Game Loop
var gameLoop = function() {
	var action = randAction();
	console.log(action);
}

var intervalLoop = function() {
	gameLoop();
	console.log(waitTime);
	if(waitTime > MINIMUM_WAIT_TIME) {
		waitTime -= DECREMENT_WAIT_TIME;
	}

	setTimeout(intervalLoop, waitTime);
}

//Timing Logic
var waitTime = INITIAL_WAIT_TIME;
setTimeout(intervalLoop, waitTime);

	
