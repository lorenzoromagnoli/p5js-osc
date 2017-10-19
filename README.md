### oscuino in p5.js

Something like firmata over osc controllable by p5.js
tested on MKR1000

built on top of [p5js-osc](https://github.com/genekogan/p5js-osc).
adapted from [osc-web](https://github.com/automata/osc-web).

#### setup OPTION 1 (with executable)

Lounch the executable for your OS that you can find in the connector_app/build folder

#### setup OPTION 2 (with nodejs and terminal)

Install [node](https://nodejs.org/)

Clone this repo and run npm to get required libraries.

	$ git clone https://github.com/genekogan/p5js-osc
	$ cd p5js-osc/connector_script
	$ npm install

Start node.

    $ node bridge.js

#### Usage

- Upload the Arduino sketch in the /sketch folder to your MKR1000.
- Run a local server and open the p5.js example

#### Example p5.js sketch

```javascript
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
```


#### API
```javascript
Oscuino(osc_IN_Port, osc_UOT_Port, oscuino_IP, bridge_IP, bridge_Port, update_frequency);
```
Constructor function, the following parameters must be specified:

- **osc_IN_Port:** must be the same as the one specified in the Arduino Sketch ()
- **osc_OUT_Port:** must be the same as the one specified in the Arduino Sketch ()
- **oscuino_IP_Port:** the Ip address of your arduino boad running the sketch
- **bridge IP:** where is the bridge running?
- **bridge port:** where is the bridge running?
- **update_frequency:** how often the value should be sent to the board.

```javascript
read(pin);
```
reads (using analogueRead) from a pin on the arduino
-**pin:** the pin you want to read

```javascript
write(pin, value);
```
writes (using analogueWrite) a value on the Arduino pin
- **pin:** the pin you want to write
- **value:** value you want to set (between 0-1024)

NB: read() and write() function are not executed immediately, to facilitate the usage of p5.js draw function, all the values are read and write according to the update_frequency value.

NB: since I was working with the tinkerkit module I configured the library to work with 7 analogue input (A0 to A6) and 7 output pin (0 to 6)
