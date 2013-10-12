window.onLoad = function() {

	var socket = io.connect("http://localhost");
	var action = document.getElementById("action");
	var test = [];
	
	socket.on('action', function(data))

