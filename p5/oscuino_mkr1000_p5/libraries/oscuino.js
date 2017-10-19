class Oscuino {


	constructor(oscPortIn, oscPortOut, oscuino_IP, bridge_IP, bridge_Port, updateRate) {
		this.setupOsc(oscPortIn, oscPortOut);
		this.input=[0,0,0,0,0,0,0]
		this.output=[0,0,0,0,0,0,0]

		this.socket;

		var _self = this;
		setInterval(function(){
			_self.getAllInputs();
			_self.writeAllInputs();
		},updateRate);
	}

	setupOsc(oscPortIn, oscPortOut) {
		var _self = this;

		_self.socket = io.connect('http://' + bridge_IP + ':' + bridge_Port, {
			port: bridge_Port,
			rememberTransport: false
		});
		_self.socket.on('connect', function() {
			_self.socket.emit('config', {
				server: {
					port: oscPortIn,
					host: bridge_IP
				},
				client: {
					port: oscPortOut,
					host: oscuino_IP
				}
			});
		});
		this.socket.on('message', function(msg) {
			if (msg[0] == '#bundle' && msg.length > 2) {
				if (msg[2][0] == '/dr') {
					var pin = msg[2][1];
					var value = msg[3][1];
					//console.log("DR", pin, value);
				} else if (msg[2][0] == '/ar') {
					var pin = msg[2][1];
					var value = msg[3][1];
					//console.log("AR", pin, value);
					//console.log(_self.input);
					_self.input[pin]=value;
				}
			}
		});
	}

	getAllInputs(){
		for (var i=0;i<7;i++){
			this.analogueRead(i);
		}
	}
	writeAllInputs(){
		for (var i=0;i<7;i++){
			this.analogueWrite(i,this.output[i]);
		}
	}

	receiveOsc(address, value) {
		console.log("received OSC: " + address + ", " + value);
	}

	sendOsc(address, value) {
		this.socket.emit('message', [address].concat(value));
	}

	digitalRead(pin) {
		this.sendOsc('/dr', [pin]);
	}

	digitalWrite (pin, value) {
		this.sendOsc('/dw', [pin, value]);
	}

	analogueRead (pin) {
		this.sendOsc('/ar', [pin]);
	}

	analogueWrite(pin, value) {
		this.sendOsc('/aw', [pin, value]);
	}

	read(pin){
		return(this.input[pin])
	}
	write(pin, value){
		this.output[pin]=value;
	}
}
