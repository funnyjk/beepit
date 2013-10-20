var socket = null;
window.onload = function() {
	var device_id = Math.random().toString(36).substring(7);
	var curr_url = document.URL;
	var new_url = curr_url.replace(/3000.*/, "5000");
	
	socket.emit('game', game.find());
