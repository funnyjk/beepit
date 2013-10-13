window.onLoad = function() {

	var socket = io.connect("http://localhost:5000");
	var action = document.getElementById("action");
	var test = [];
	
	socket.on('action', function(data))

