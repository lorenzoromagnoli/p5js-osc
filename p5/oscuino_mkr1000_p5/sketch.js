var oscuino_IP='192.168.0.10'
var osc_IN_Port='10000'
var osc_UOT_Port='12000'
var bridge_IP='127.0.0.1'
var bridge_Port='8081'

var oscuino;

var blink=0;

function setup() {
	createCanvas(500, 500);
	oscuino= new Oscuino(osc_IN_Port, osc_UOT_Port, oscuino_IP, bridge_IP, bridge_Port, 100);

	setInterval(function(){
		blink=toggle(blink)
		console.log(blink);

	},1000);
}

function draw() {
		background(255,255,255);
		if(blink==1){
			fill(255,0,0);
			oscuino.write(6,255);
		}else{
			fill(0,255,0);
			oscuino.write(6,0);
		}
		rect(oscuino.read(0),oscuino.read(1),oscuino.read(2),oscuino.read(3))
}

function toggle(val){
	if (val==0){
		return(1)
	}else{
		return(0);
	}
}
