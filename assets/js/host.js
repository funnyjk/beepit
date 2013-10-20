:x
window.onload = function() {
	var device_id = Math.random().toString(36).substring(7);
	var curr_url = document.URL;
	var new_url = curr_url.replace(/3000.*/, "5000");
	if (io) {
		socket = io.connect(new_url);
		socket.emit("create_game", {"device_id" : device_id});
		socket.on("num_players", function(data){
			document.getElementById("num_players").innerHTML = data["num_players"];
			if (data["num_players"] == 1 && data["num_players"] == "in_progress") {
				socket.emit("declare_winner", {});
			}
		});
	} 
	else {
		console.log("socker.io.js ERROR")
	}
}
function beginGame() {
	socket.emit("start_game", {});
}
