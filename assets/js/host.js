window.onLoad = function() {
	var socket = io.connect('http://localhost:5000');
	var send = function(message) {
		socket.emit("message", {"message" : message});
	}
	socket.on("message", function (data) {
		console.log(data["message"]);
	});
}