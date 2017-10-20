bridge_IP='0.0.0.0'
bridge_Port='8081'

function setupOsc(oscPortIn, oscPortOut, success_callback) {
	var socket;

	socket = io.connect('http://' + bridge_IP + ':' + bridge_Port, {
		port: bridge_Port,
		rememberTransport: false,
		reconnection: true,
		reconnectionDelay: 1000,
	});

	socket.on('connect', function() {
		console.log("connected");
		success_callback(socket);
	});

	socket.on('disconnect', function() {
		console.log("disconnected")
	});

	socket.on('message', function(data) {
		console.log(data)
	});

	return (socket);
}
