window.onload = function() {
	
	var active = true;
	var device_id = Math.random().toString(36).substring(7);
	var threshold = 7.00;

	var tilt_x = false; //tilt along wide axis
	var tilt_y = false; //tilt along long axis
	var tilt_z = false; //normal

	function action_tilt_wide() {
		document.getElementById("large_message").innerHTML = "Xxxxx"
		try {
			sendAction(active, 1, device_id);
		} catch (e) {
			alert(e)
		}
	}
	function action_tilt_long() {
		document.getElementById("large_message").innerHTML = "Yyyyyyy"
		try {
			sendAction(active, 2, device_id);
		} catch (e) {
			alert(e)
		}
	}
	function action_tap() {
		document.getElementById("large_message").innerHTML = "Tappppp"
		try {
			sendAction(active, 3, device_id);
		} catch (e) {
			alert(e)
		}
	}
	function tilt_neutral() {
		document.getElementById("large_message").innerHTML = "Zzzz"
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
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	} else {
		alert("device orientation, not supported")
	}
	function deviceMotionHandler(eventData) {
	  var info, xyz = "[X, Y, Z]";
		// Grab the acceleration including gravity from the results
		acceleration = eventData.accelerationIncludingGravity;
		info = xyz.replace("X", Math.round(acceleration.x*1000)/1000);
		info = info.replace("Y", Math.round(acceleration.y*1000)/1000);
		info = info.replace("Z", Math.round(acceleration.z*1000)/1000);
		document.getElementById("accel_grav").innerHTML = info;

		if (Math.abs(acceleration.x) > threshold && !tilt_x) {
			tilt_x = true;
			tilt_y = false;
			tilt_z = false; 
			action_tilt_wide();
		} else if (Math.abs(acceleration.y) > threshold && !tilt_y) {
			tilt_y = true;
			tilt_x = false;
			tilt_z = false; 
			action_tilt_long();
		} else if (Math.abs(acceleration.z) > threshold && !tilt_z) {
			tilt_z = true;
			tilt_x = false;
			tilt_y = false; 
			tilt_neutral();
		}
	}

	var socket = null;

	document.getElementById("action_tap_area").onclick = action_tap;
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
