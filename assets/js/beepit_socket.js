var socket = null;
window.onload = function() {
	var curr_url = document.URL;
	var new_url = curr_url.replace(/3000.*/, "5000");
	if (io) {
		socket = io.connect(new_url);
		socket.on("message", function (data) {
			alert(data["message"]);
		});
		socket.on("response", function (data) {
			if (data.pass != "true") {
				active = false;
				alert("you lose!");
			}
		});
		socket.emit("message", {"message" : "hello !"});
	} 
	else {
		console.log("socker.io.js ERROR")
	}
}
function send(message) {
	socket.emit("message", {"message" : message});
}
function sendAction(active, action_id, device_id) {
	if (!active) return; //added this line to prevent invalid plays from sending socket message
	var curr_time = new Date().getTime();
	socket.emit("action", {
		"action_id" : action_id,
		"time_stamp" : curr_time,
		"device_id" : device_id,
	});
}