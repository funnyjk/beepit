var NUM_ACTIONS = 3;

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
	if(waitTime > 500) {
		waitTime -= 500;
	}

	setTimeout(intervalLoop, waitTime);
}

//Timing Logic
var waitTime = 3000;
setTimeout(intervalLoop, waitTime);

	
