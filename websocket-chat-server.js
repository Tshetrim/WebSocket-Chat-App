"use strict";
const { emit } = require("nodemon");
const WebSocket = require("ws");

const commands = {"/help": helpCommandHandler, "/exit": exitCommandHandler, "/pop": popCommandHandler};

function createWSS(portNumber, clients, clientNames){
    const wss =  new WebSocket.Server({ port: portNumber }, () => {
        console.log("Chat Server bound on port", portNumber);
    });
    bindEventHandlers(wss, clients, clientNames);
    return wss;
};

function bindEventHandlers(wss, clients, clientNames){
    wss.on("connection", (ws, upgradeReq) => {
        if (!ws instanceof WebSocket) {
            console.log("Incoming connection is not a WebSocket");
            return;
        }
    
        console.log("client", upgradeReq.socket.remotePort, "connected");
        clients.push(ws);
        popCommandHandler(ws, clients);
        sendServerMessage(ws, `Type /help for commands`);

        ws.on("message", (data) => {
            const sender = parseUserName(data.toString());
            const message = parseMessage(data.toString());

            if(data.toString().includes("/announce")){
                sendServerWideMessage(clients, `${sender} has joined the chatroom!`);
                clientNames[upgradeReq.socket.remotePort] = sender;
            }
            else if(commands[message]!=undefined)
                commands[message](ws, clients, upgradeReq);
            else{
                clients.forEach((client) => {
                    if (ws === client) return;
                    client.send(data);
                });
            }
        });
    
        ws.on("error", () => {
            console.log("Error");
            console.log(`ws ${upgradeReq.socket.remotePort} disconnected`);
            clients.splice(clients.indexOf(ws), 1);
        });
    
        ws.on("close", () => {
            console.log(`client ${upgradeReq.socket.remotePort} disconnected through end`);
            sendServerWideMessage(clients, `client ${clientNames[upgradeReq.socket.remotePort] || upgradeReq.socket.remotePort} disconnected`)
            clients.splice(clients.indexOf(ws), 1);
        });
    });
}

function sendServerMessage(client, message){
    client.send(`[server]: ${message}`);
}

function sendServerWideMessage(clients, message){
    clients.forEach((client) => {
        client.send(`[server]: ${message}`);
    });
}

function parseMessage(message){
    return message.substring(message.indexOf(":")+2);
}

function parseUserName(message){
    return message.substring(1,message.indexOf(":")-1);
}

//      / commands 
function helpCommandHandler(ws, clients){
    const message = `Type: /exit to leave the chat`;
    sendServerMessage(ws, message);
    sendServerMessage(ws, "/pop to see the number of people in chat");
    sendServerMessage(ws, "more commands on the way soon!");
}

function exitCommandHandler(ws, clients, sender){
    ws.close();
}

function popCommandHandler(ws, clients){
    sendServerMessage(ws, `There are currently ${clients.length} people in the chat room`);
}

class WebSocketServer {
    constructor(port) {
        this._clients = [];
        this._client_names={};
        this._wss = createWSS(port, this._clients, this._client_names);
    }
  
    get wss(){
        return this._wss;
    }

    get clients(){
        return this._clients;
    }
}

module.exports = WebSocketServer;