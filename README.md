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

- Upload the Arduino sketch in the /arduino folder to your MKR1000.
- Run the connector
- create a Folder called connector in your home directory (the connector should tell you where)
- copy the examples inside the /p5 folder to your connector folder.
- go to http://localhost:8081 and select which sketch you want to run.

#### Example p5.js sketch

```javascript
// those port are fixed if you are using the connector and the provided Arduino sketch
osc_IN_Port='10000';
osc_OUT_Port='12000';

//your Arduino IP address
var oscuino_IP = '192.168.0.12';
var oscuino;

var lightSensorValue=0;

function setup() {
	createCanvas(500, 500);

	//this creates a websocket
	setupOsc(osc_IN_Port, osc_OUT_Port, function(socket) {
		console.log(socket);
		//once created pass the socket to the oscuino constructor
		oscuino = new Oscuino(oscuino_IP, 50, socket);
	});
}

function draw() {

	if (oscuino){ //wait for the object to exist
		lightSensorValue=oscuino.read(0);
		background(lightSensorValue/4);
		oscuino.write(0,lightSensorValue);
	}
}
```


#### API
```javascript
setupOsc(osc_IN_Port, osc_OUT_Port, function(socket){}
```

Setup the osc socket;
the callback function fired after the websocket connection is successfull opened

```javascript
Oscuino(oscuino_IP, update_frequency, socket);
```
Constructor function, the following parameters must be specified:


- **oscuino_IP:** the Ip address of your arduino boad running the sketch
- **update_frequency:** how often the value should be sent to the board.
- **websocket**: awebsocket connection;


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
