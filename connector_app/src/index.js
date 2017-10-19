const {
	app,
	BrowserWindow
} = require('electron')
const path = require('path')
const url = require('url')
var osc = require('node-osc');
const osHomedir = require('os-homedir');
var express = require('express');
var serveIndex = require('serve-index')
const {ipcMain} = require('electron')
var ip = require('ip');
const {shell} = require('electron')


var webserver = express();
var server = require('http').Server(webserver);
var io = require('socket.io')(server);

var oscServer, oscClient;
var isConnected = false;

var ipAddress=ip.address();
var bridge_Port = 8081;

var webserverFolder = osHomedir() + "/connector"
console.log(webserverFolder);

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
		width: 300,
		height: 300,
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
		connect(function(){
			event.sender.send('connected', {
				'ip':ipAddress,
				'port':bridge_Port,
				'path':webserverFolder
			});
			shell.openExternal('http://'+ipAddress+':'+bridge_Port);
		});

	}
})

ipcMain.on('synchronous-message', (event, arg) => {
	console.log(arg) // prints "ping"
	event.returnValue = 'pong'
})


const connect = function(callback) {
	console.log("running webserver on port: " + bridge_Port)

	server.listen( bridge_Port,'0.0.0.0');

	webserver.use('/',
		express.static(webserverFolder),
		serveIndex(webserverFolder, {
			'icons': true
		})
	);

	io.on('connection', function(socket) {
		console.log('connection');

		socket.emit('news', {
			hello: 'world'
		});
		socket.on('my other event', function(data) {
			console.log(data);
		});
		socket.on("config", function(obj) {
			isConnected = true;
			oscServer = new osc.Server(obj.server.port, obj.server.host);
			oscClient = new osc.Client(obj.client.host, obj.client.port);
			oscClient.send('/status', socket.sessionId + ' connected');
			oscServer.on('message', function(msg, rinfo) {
				//console.log("arduino->",msg);
				socket.emit("message", msg);
			});
			socket.emit("connected", 1);
		});
		socket.on("message", function(obj) {
			//console.log("p5->",obj);
			oscClient.send.apply(oscClient, obj);
		});
		socket.on('disconnect', function() {
			if (isConnected) {
				oscServer.kill();
				oscClient.kill();
			}
		});
	});

	callback();
}


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// io.sockets.on('connection', function (socket) {
// 	console.log('connection');
// 	socket.on("config", function (obj) {
// 		isConnected = true;
//     	oscServer = new osc.Server(obj.server.port, obj.server.host);
// 	    oscClient = new osc.Client(obj.client.host, obj.client.port);
// 	    oscClient.send('/status', socket.sessionId + ' connected');
// 		oscServer.on('message', function(msg, rinfo) {
// 			//console.log("arduino->",msg);
// 			socket.emit("message", msg);
// 		});
// 		socket.emit("connected", 1);
// 	});
//  	socket.on("message", function (obj) {
// 		//console.log("p5->",obj);
// 		oscClient.send.apply(oscClient, obj);
//   	});
// 	socket.on('disconnect', function(){
// 		if (isConnected) {
// 			oscServer.kill();
// 			oscClient.kill();
// 		}
//   	});
// });
