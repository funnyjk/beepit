var socket = null;
window.onload = function() {
	socket = io.connect('http://localhost:5000');
	socket.on("message", function (data) {
		console.log(data["message"]);
	});
	socket.emit("message", {"message" : "hello !"});
}
function send(message) {
	socket.emit("message", {"message" : message});
}