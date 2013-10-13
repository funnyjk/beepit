//added this block to get aroung port issue
//--- hacky.... but works
var curr_url = document.URL;
var new_url = curr_url.replace("3000", "5000");
var s = document.createElement( 'script' );
s.setAttribute( 'src', new_url+"socket.io/socket.io.js");
document.write(s.outerHTML);
//---
var socket = null;
window.onload = function() {
	if (io) {
		socket = io.connect(new_url);
		socket.on("message", function (data) {
			console.log(data["message"]);
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
function addScript( src ) {
  var s = document.createElement( 'script' );
  s.setAttribute( 'src', src );
  document.body.appendChild( s );
}