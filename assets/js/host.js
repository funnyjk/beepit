var socket = null;
window.onload = function() {
	if (io) {}
		socket = io.connect('http://localhost');
		socket.on("message", function (data) {
			console.log(data["message"]);
		});
		socket.emit("message", {"message" : "hello !"});
	} else {
		console.log("socker.io.js ERROR")
	}
}
function send(message) {
	socket.emit("message", {"message" : message});
}