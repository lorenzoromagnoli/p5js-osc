var oscuino_IP='10.130.22.52'
var osc_IN_Port='10000'
var osc_UOT_Port='12000'
var bridge_IP='0.0.0.0'
var bridge_Port='8081'

var oscuino;

var blink=0;

function setup() {
	createCanvas(500, 500);
	oscuino= new Oscuino(osc_IN_Port, osc_UOT_Port, oscuino_IP, bridge_IP, bridge_Port, 100);

	setInterval(function(){
		blink=toggle(blink)
	},1000);
}

function draw() {
		background(255,255,255);
		var lightSensorValue=oscuino.read(0);

		fill(lightSensorValue);
		rect(100,100,100,100);
		oscuino.write(6,lightSensorValue)
}

function toggle(val){
	if (val==0){
		return(1)
	}else{
		return(0);
	}
}
