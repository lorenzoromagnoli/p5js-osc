// In renderer process (web page).
const {
	ipcRenderer
} = require('electron')


require('electron').ipcRenderer.on('ping', (event, message) => {
      console.log(message)  // Prints 'whoooooooh!'
    })


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

ipcRenderer.on('discovery_down', (event, arg) => {
	console.log("something disappeared")
	console.log(arg)
})

ipcRenderer.on('discovery_up', (event, arg) => {
	console.log("something uppeared")
	console.log(arg)
	document.getElementById("boardList").innerHTML=document.getElementById("boardList").innerHTML+'<li id='+arg.addresses[0]+'>'+arg.name+' at '+arg.addresses[0]+'</li>'
})

function connect(){
	ipcRenderer.send('asynchronous-message', 'connect')
}
