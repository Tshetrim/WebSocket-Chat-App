//replace localhost with port porwarded ip if you want to run this online, make sure the port number is the external port chosen
const socket = new WebSocket("ws://localhost:8125");

let sendChannel,
	receiveChannel,
	chatWindow = document.querySelector(".chat-window"),
	chatWindowMessage = document.querySelector(".chat-window-message"),
	chatThread = document.querySelector(".chat-thread");

// Get User Name
let username = prompt("Please enter your username:");
if(username!=undefined){
	const welcomeMessage = document.getElementById("welcome-message");
	welcomeMessage.innerText += ` ${username}`;
}

// Connect to Chat Server
createConnection();

// On form submit, send message
chatWindow.onsubmit = function (e) {
	e.preventDefault();

	sendData();

	return false;
};

function initializeBlobDecoder(){
	const reader = new FileReader();
	reader.addEventListener("loadend", () => {
		const message = reader.result;
		// message is now a string
		console.log(message);
		handleMessageRecieved(message);
	});
	return reader;
};

function createConnection() {
	const reader = initializeBlobDecoder();

	socket.onopen = function (event) {
		console.log("Connected to server");
		socket.send(`[${username}]:/announce`);
	};

	socket.onmessage = async function (event) {
		if(event.data instanceof Blob)
			reader.readAsText(event.data);
		else 
			handleMessageRecieved(event.data);
	};

	socket.onclose = function () {
		console.log("Disconnected from server");
	};
}

function sendData() {
	socket.send(`[${username}]: ${chatWindowMessage.value}`);
	handleMessageSend();
}

function handleMessageSend() {
	console.log("Message sent: ", chatWindowMessage.value);

	let chatNewThread = document.createElement("li"),
		chatNewMessage = document.createTextNode(chatWindowMessage.value);

	// chatNewThread.classList.add(`${username}`);
	chatNewThread.classList.add(`client`);

	// Add message to chat thread and scroll to bottom
	chatNewThread.appendChild(chatNewMessage);
	chatThread.appendChild(chatNewThread);
	chatThread.scrollTop = chatThread.scrollHeight;

	// Clear text value
	chatWindowMessage.value = "";
}

function handleMessageRecieved(message) {
	let username = extractUsername(message);
	console.log(`Received message from ${username}:`, message);
	
	let chatNewThread = document.createElement("li"),
	chatNewMessage = document.createTextNode(message);
	
	// chatNewThread.classList.add(`${username}`);
	if(username==="server")
		chatNewThread.classList.add(`server`);
	else
		chatNewThread.classList.add(`other`);

	// Add message to chat thread and scroll to bottom
	chatNewThread.appendChild(chatNewMessage);
	chatThread.appendChild(chatNewThread);
	chatThread.scrollTop = chatThread.scrollHeight;

}

function handleSendChannelStateChange() {
	chatWindowMessage.disabled = false;
	chatWindowMessage.focus();
	chatWindowMessage.value = "";
}

function handleReceiveChannelStateChange() {
	let readyState = receiveChannel.readyState;
}

function extractUsername(string) {
	const colonIndex = string.indexOf(':');
	return string.substring(1, colonIndex-1);
}