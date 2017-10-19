// In renderer process (web page).
const {
	ipcRenderer
} = require('electron')

ipcRenderer.on('connected', (event, arg) => {
	console.log(arg)
	var d = document.getElementById("disconnected");
	var c = document.getElementById("connected");

	d.classList.add("hidden");
	c.classList.remove("hidden");

	document.getElementById("IP").innerHTML=arg.ip
	document.getElementById("PORT").innerHTML=arg.port;
	document.getElementById("PATH").innerHTML=arg.path;

})

function connect(){
	ipcRenderer.send('asynchronous-message', 'connect')
}
