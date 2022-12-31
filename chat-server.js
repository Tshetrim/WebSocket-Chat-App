"use strict";
const net = require("node:net");

const clients = [];

const server = net.createServer((socket) => {
	console.log("client connected");
	clients.push(socket);
	console.log(socket.remotePort);
	// console.log(socket.remoteAddress + ":" + socket.remotePort);

	socket.on("data", (data) => {
		clients.forEach((client) => {
			// if (client === socket) return;
			client.write(data);
		});
	});

	socket.on("error", () => {
		console.log("Error");
		console.log(`client ${socket.remotePort} disconnected`);
		clients.splice(clients.indexOf(socket), 1);
		// clients = clients.filter((client) => client !== socket);
	});

	socket.on("end", () => {
		console.log(`client ${socket.remotePort} disconnected through end`);
		clients.splice(clients.indexOf(socket), 1);
	});


});

server.on("error", (error) => {
	console.error(error);
});

server.listen(8124, () => {
	console.log("server bound");
});
