var oscuino_IP1 = '192.168.0.12';
var oscuino1;
var oscuino_IP2 = '192.168.0.10';
var oscuino2;

var x=0;
var y=0;
var xOld;
var yOld;

var lightSensorValue=0;

function setup() {
	createCanvas(500, 500);
	setupOsc(osc_IN_Port, osc_OUT_Port, function(socket) {
		console.log(socket);
		oscuino1 = new Oscuino(oscuino_IP1, 50, socket);
		oscuino2 = new Oscuino(oscuino_IP2, 50, socket);
	});
}

function draw() {
	//background(255,255,255);
	if (oscuino1){
		x = oscuino1.read(0);
		y = oscuino1.read(1);
	}

	x = int(map(x, 0, 1024, 0, width));
	y = int(map(y, 0, 1024, 0, height));

	if (oscuino2){
		lightSensorValue=oscuino2.read(0);
	}

	strokeWeight(int(map(lightSensorValue, 0, 1024, 0, 20)))
	stroke(int(map(lightSensorValue, 0, 1024, 0, 255)),50)

	//console.log(x, y);
	line(xOld, yOld, x, y)

	xOld = x;
	yOld = y;

	fill(0);
	point(x, y);
}
