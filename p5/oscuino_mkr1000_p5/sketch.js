osc_IN_Port='10000';
osc_OUT_Port='12000';

var oscuino_IP = '192.168.0.12';
var oscuino;

var lightSensorValue=0;

function setup() {
	createCanvas(500, 500);
	setupOsc(osc_IN_Port, osc_OUT_Port, function(socket) {
		console.log(socket);
		oscuino = new Oscuino(oscuino_IP, 50, socket);
	});
}

function draw() {

	if (oscuino){
		lightSensorValue=oscuino.read(0);
		background(lightSensorValue/4);
		oscuino.write(0,lightSensorValue);
	}
}
