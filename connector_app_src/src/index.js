const {
	app,
	BrowserWindow,
	ipcMain,
	shell,
} = require('electron')
const path = require('path')
const url = require('url')
const osc = require('node-osc');
const osHomedir = require('os-homedir');
const express = require('express');
const serveIndex = require('serve-index')
const ip = require('ip');
const mdns = require('mdns');


var webserver = express();
var server = require('http').Server(webserver);
var io = require('socket.io')(server);

var oscServer;
var oscClients = [];
var isConnected = false;

var ipAddress = ip.address();
var bridge_Port = 8081;

var webserverFolder = osHomedir() + "/connector"
console.log(webserverFolder);

let content;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
	app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 500,
		height: 500,
	});

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	// Open the DevTools.
	//mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	content = mainWindow.webContents
	//console.log(content)
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// this is used to comunicate with the frontend
ipcMain.on('asynchronous-message', (event, arg) => {
	console.log(arg) // prints "ping"
	event.sender.send('asynchronous-reply', 'pong')
	if (arg == 'connect') {
		//need to connect here
		connect(function() {
			event.sender.send('connected', {
				'ip': ipAddress,
				'port': bridge_Port,
				'path': webserverFolder
			});
			shell.openExternal('http://' + ipAddress + ':' + bridge_Port);
		});

	}
})

ipcMain.on('synchronous-message', (event, arg) => {
	console.log(arg) // prints "ping"
	event.returnValue = 'pong'
})


io.on('connection', function(socket) {
	console.log('connection');

	socket.on("config", function(obj) {
		isConnected = true;
		oscServer = new osc.Server(obj.server.port, obj.server.host);

		var oscClient = new osc.Client(obj.client.host, obj.client.port);
		oscClients.push(oscClient);
		console.log("clients", oscClients);

		oscClient.send('/status', socket.sessionId + ' connected');

		oscServer.on('message', function(msg, rinfo) {
			if (isConnected) {
				console.log("arduino->", msg, rinfo.address);
				io.emit("message", {
					'sender': rinfo.address,
					'message': msg
				});
			}
		});

		io.emit("connected", 1);
	});

	socket.on("message", function(obj) {
		//console.log("p5->",obj);

		oscClients.forEach(function(client) {
			if (client.host == obj.dest) {
				client.send.apply(client, obj.message);
			}
		})
		//oscClient.send.apply(oscClient, obj);
	});

	socket.on('disconnect', function() {
		console.log("disconnecting");
		if (isConnected) {
			console.log("disconnected");
			oscServer.kill();
			oscClients.forEach(function(client) {
				client.kill();
			})
			//oscClient.kill();
			oscClients = [];
		}
		isConnected = false;
	});
});


const connect = function(callback) {
	console.log("running webserver on port: " + bridge_Port)

	server.listen(bridge_Port, '0.0.0.0');

	webserver.use('/',
		express.static(webserverFolder),
		serveIndex(webserverFolder, {
			'icons': true
		})
	);
	runMDNS();
	callback();
}

function runMDNS() {
	// watch all http servers
	var browser = mdns.createBrowser(mdns.tcp('ino'));

	browser.on('serviceUp', function(service) {
		console.log("service up: ", service);
		content.send("discovery_up", service);
	});
	browser.on('serviceDown', function(service) {
		console.log("service down: ", service);
		content.send("discovery_down", service);
	});
	browser.start();

	// discover all available service types
	var all_the_types = mdns.browseThemAll(); // all_the_types is just another browser...

}
