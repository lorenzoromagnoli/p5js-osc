class Oscuino {

	constructor(oscuino_IP,updateRate,socket) {
		this.oscuino_IP=oscuino_IP;
		this.osc_IN_Port='10000'
		this.osc_OUT_Port='12000'
		this.bridge_IP='0.0.0.0'
		this.bridge_Port='8081'
		this.updateRate=updateRate;

		this.socket=socket;
		this.setupOscuino();

		this.input=[0,0,0,0,0,0,0]
		this.output=[0,0,0,0,0,0,0]


		var _self = this;
		setInterval(function(){
			_self.getAllInputs();
			_self.writeAllInputs();
		},updateRate);
	}

	setupOscuino() {
		var _self = this;

		this.socket.emit('config', {
			server: {
				port: _self.osc_IN_Port,
				host: _self.bridge_IP
			},
			client: {
				port: _self.osc_OUT_Port,
				host: _self.oscuino_IP
			}
		});

		this.socket.on('connected', function(data) {
			console.log("oscuino connected");
		});

		this.socket.on('message', function(data) {

			var sender=data.sender;
			var msg=data.message;
			console.log(data);
			if (sender==_self.oscuino_IP){
				console.log("received something from"+ _self.oscuino_IP );
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
			}
		}
	);
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
		this.socket.emit('message', {'dest':this.oscuino_IP,'message':[address].concat(value)});
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
